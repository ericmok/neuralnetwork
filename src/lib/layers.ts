/*global module, require*/

import {N, Neuron} from './neurons';

export interface LayerDefinition {
    kind: typeof Neuron,
    amount: number
}

/**
Constructor to create a new layer of neurons
*/
export class Layer {
    name: string;
    neurons: Array<Neuron>;
    inputBuffer: Array<number>;
    outputBuffer: Array<number>;
    inputError: Array<number>;
    outputError: Array<number>;

    constructor(args : Array<LayerDefinition>) {
        this.name = Math.random().toString(36).substring(2);

        this.neurons = [];

        this.createMixNeurons(args);

        this.inputBuffer = [];
        this.outputBuffer = [];
        this.inputError = [];
        this.outputError = [];

        this.resetBuffers();
    }

    createMixNeurons(args : Array<LayerDefinition>) {
        for (let i = 0; i < args.length; i++) {
            for (let a = 0; a < args[i].amount; a++) {
                this.neurons.push(new args[i].kind());
            }
        }
    }

    resetBuffers() {
        for (let i = 0; i < this.neurons.length; i += 1) {
            this.inputBuffer[i] = 0;
            this.outputBuffer[i] = 0;
            this.inputError[i] = 0;
            this.outputError[i] = 0;
        }
    }

    forward() {
        (() => {
            this.neurons.forEach((el, index, arr) => {
                this.outputBuffer[index] = el.forward(this.inputBuffer[index]);
            });
        })();
    }

    backward () {
        var self = this;

        this.neurons.forEach(function (el : Neuron, index : number, arr : Array<Neuron>) {
            // TODO: Test this
            self.inputError[index] = el.backward(self.outputError[index], self.outputBuffer[index]);
        });
    }
}
