/*global module, require*/

import {Layer} from './layers.ts';
import {Connection} from './connections.ts';

export function meanSquaredError(errors: Array<number>): number {
    var mean = errors.reduce((prev: number, curr: number, index: number) => {
        return prev + Math.pow(curr, 2);
    }, 0);
    return mean / errors.length;
}

export class Network {
    layers: Map<string, Layer>;
    forwardConnections: Map<string, Array<Connection>>;
    backwardConnections: Map<string, Array<Connection>>;
    rootLayer: Layer | null;
    outputLayer: Layer | null;

    constructor() {
        this.layers = new Map<string, Layer>();
        this.forwardConnections = new Map<string, Array<Connection>>();
        this.backwardConnections = new Map<string, Array<Connection>>();
        this.rootLayer = null;
        this.outputLayer = null;
    }

    setRootLayer(layer: Layer) {
        this.rootLayer = layer;
        this.layers[layer.name] = layer;
    }

    setOutputLayer(layer: Layer) {
        this.outputLayer = layer;
        this.layers[layer.name] = layer;
    }

    addLayer(layer: Layer) {
        this.layers[layer.name] = layer;
    }

    addConnection(con: Connection) {
        this.forwardConnections[con.inputLayer.name] = this.forwardConnections[con.inputLayer.name] || [];
        this.forwardConnections[con.inputLayer.name].push(con);

        this.backwardConnections[con.outputLayer.name] = this.backwardConnections[con.outputLayer.name] || [];
        this.backwardConnections[con.outputLayer.name].push(con);

        this.layers[con.inputLayer.name] = con.inputLayer;
        this.layers[con.outputLayer.name] = con.outputLayer;
    }

    resetLayers() {
        for (let prop in this.layers) {
            if (this.layers.hasOwnProperty(prop)) {
                this.layers[prop].resetBuffers();
            }
        }
    }

    forwardPropogate(input: Array<number>): Array<number> {
        var self = this,
            currentLayer: Layer = null,
            connections: Array<Connection> = null,
            openSet: Array<Layer> = [],
            outputLayerReached = false;

        // Located outside the for loop: see <http://jsperf.com/closure-vs-name-function-in-a-loop/2>. jslint also complains otherwise
        function forwardEachConnectionIn(connections: Array<Connection>) {
            connections.forEach(function (connection: Connection) {
                connection.forward(); // If there is a connection from output layer to another, there is a final 'push'
                openSet.push(connection.outputLayer);
            });
        }

        this.rootLayer.inputBuffer = input;

        // Initial condition for Breadth First exploration
        openSet.push(this.rootLayer);

        while (openSet.length > 0) {

            currentLayer = openSet.shift();

            currentLayer.forward();
            connections = this.forwardConnections[currentLayer.name] || [];

            forwardEachConnectionIn(connections);

            if (currentLayer === this.outputLayer) {
                outputLayerReached = true;
                break;
            }
        }

        return this.outputLayer.outputBuffer;
    }

    backwardPropogate(errorVector: Array<number>) {

        var self = this,
            currentLayer: Layer = null,
            connections: Array<Connection> = null,
            openSet: Array<Layer> = [];

        function backwardEachConnectionIn(connections: Array<Connection>) {
            connections.forEach(function (connection: Connection) {
                connection.backward();
                openSet.push(connection.inputLayer);
            });
        }

        this.forEachConnection(function (connection: Connection) {
            connection.resetDerivatives();
        });

        this.outputLayer.outputError = errorVector;

        // Initial condition for Breadth First exploration
        openSet.push(self.outputLayer);

        while (openSet.length > 0) {

            currentLayer = openSet.shift();
            currentLayer.backward();

            connections = self.backwardConnections[currentLayer.name] || [];

            backwardEachConnectionIn(connections);

            // Unless recurrent...
            // TODO: Non 1 to 1 typescript conversion. inputLayer changed to rootLayer
            if (currentLayer === this.rootLayer) {
                break;
            }
        }
    }

    forEachConnection(callback: (el: Connection) => void) {

        for (let i in this.forwardConnections) {
            if (this.forwardConnections.hasOwnProperty(i)) {
                this.forwardConnections[i].forEach(function (el: Connection, index: number) {
                    callback(el);
                });
            }
        }
    }

    // TODO
    exploreForward (layerCallback: Function, connectionsCallback: Function) {
        'use strict';

        var self = this,
            currentOpenSet: Array<Layer> = [],
            nextOpenSet: Array<Layer> = [],
            currentLayer: Layer,
            connections: Array<Connection>;

        // TODO: Non 1-1 typescript conversion, inputLayer to rootLayer
        currentOpenSet.push(this.rootLayer);

        while (currentOpenSet.length > 0 || nextOpenSet.length > 0) {

            // tick tock
            if (currentOpenSet.length === 0) {
                currentOpenSet = nextOpenSet;
                nextOpenSet = [];
            }

            currentLayer = currentOpenSet.shift();

            layerCallback(currentLayer);

            connections = this.forwardConnections[currentLayer.name] || [];

            nextOpenSet.push(connectionsCallback(connections));

            // Unless recurrent...
            // TODO: Non 1-1 typescript conversion, inputLayer to rootLayer
            if (currentLayer === this.rootLayer) {
                break;
            }
        }
    }

    train(input: Array<number>, targetVector: Array<number>, options?: any) {
        if (input.length !== this.rootLayer.inputBuffer.length) {
            throw new Error('Wrong input dimensions');
        }
        if (targetVector.length !== this.outputLayer.outputBuffer.length) {
            throw new Error('Wrong output dimensions');
        }

        var self = this,
            connections: Array<Connection>,
            errorVector: Array<number> = [],
            options = options || {},
            step: number = options.step || 0.21,
            momentum: number = options.momentum || 0.1,
            dropout: number = options.dropout || 0.2;

        this.forEachConnection(function (con: Connection) {
            con.resetDerivatives();

            // TODO: Make type friendly
            if (!con._lastStep) {
                con._lastStep = con.parameters.map(function (el, index) {
                    return 0;
                });
            }
        });

        this.resetLayers();
        this.forwardPropogate(input);

        errorVector = targetVector.map(function (target, index) {
            return target - self.outputLayer.outputBuffer[index];
        });

        this.backwardPropogate(errorVector);


        this.forEachConnection(function (connection) {
            if (connection.parameters.length !== connection.derivatives.length) {
                throw new Error('Wrong derivative dims');
            }

            connection.parameters = connection.parameters.map(function (el, index) {
                var calculatedStep: number, newParam: number;

                if (Math.random() < dropout) {
                    return el;
                }

                calculatedStep = step * connection.derivatives[index] + momentum * connection._lastStep[index];
                newParam = el + calculatedStep;

                connection._lastStep[index] = calculatedStep;

                return newParam;
            });
        });

        return meanSquaredError(errorVector);

    }
}
