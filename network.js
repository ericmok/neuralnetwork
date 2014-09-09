/*global module, require*/


function Network() {
    'use strict';
    
    this.layers = {};
    this.forwardConnections = {};
    this.backwardConnections = {};
    this.rootLayer = null;
    this.outputLayer = null;
}


Network.prototype.setRootLayer = function (layer) {
    'use strict';
    
    this.rootLayer = layer;
    this.layers[layer.name] = layer;
};

Network.prototype.setOutputLayer = function (layer) {
    'use strict';
    
    this.outputLayer = layer;
    this.layers[layer.name] = layer;
};

Network.prototype.addLayer = function (layer) {
    'use strict';
    
    this.layers[layer.name] = layer;
};

Network.prototype.addConnection = function (con) {
    'use strict';
    
    this.forwardConnections[con.inputLayer.name] = this.forwardConnections[con.inputLayer.name] || [];
    this.forwardConnections[con.inputLayer.name].push(con);

    this.backwardConnections[con.outputLayer.name] = this.backwardConnections[con.outputLayer.name] || [];
    this.backwardConnections[con.outputLayer.name].push(con);
    
    this.layers[con.inputLayer.name] = con.inputLayer;
    this.layers[con.outputLayer.name] = con.outputLayer;
};


Network.prototype.resetLayers = function () {
    'use strict';
    
    var prop;
    
    for (prop in this.layers) {
        if (this.layers.hasOwnProperty(prop)) {
            this.layers[prop].resetBuffers();
        }
    }
};


Network.prototype.forwardPropogate = function (input) {
    'use strict';
    
    var self = this,
        currentLayer = null,
        connections = null,
        openSet = [],
        outputLayerReached = false;
    
    // Located outside the for loop: see <http://jsperf.com/closure-vs-name-function-in-a-loop/2>. jslint also complains otherwise
    function forwardEachConnectionIn(connections) {
        connections.forEach(function (connection) {
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
};

Network.prototype.backwardPropogate = function (errorVector) {
    'use strict';
    
    var self = this,
        currentLayer = null,
        connections = null,
        openSet = [];
    
    function backwardEachConnectionIn(connections) {
        connections.forEach(function (connection) {
            connection.backward();
            openSet.push(connection.inputLayer);
        });
    }
    
    this.forEachConnection(function (connection) {
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
        if (currentLayer === this.inputLayer) {
            break;
        }
    }
};

Network.prototype.forEachConnection = function (callback) {
    'use strict';
    var i;
    
    for (i in this.forwardConnections) {
        if (this.forwardConnections.hasOwnProperty(i)) {
            this.forwardConnections[i].forEach(function (el, index) {
                callback(el);
            });
        }
    }
};

// TODO:
Network.prototype.exploreForward = function (layerCallback, connectionsCallback) {
    'use strict';
    
    var self = this,
        currentOpenSet = [],
        nextOpenSet = [],
        currentLayer,
        connections;
    
    currentOpenSet.push(this.inputLayer);
    
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
        if (currentLayer === this.inputLayer) {
            break;
        }
    }
};


Network.prototype.train = function (input, output) {
    'use strict';
    
    //console.log('TRAINING');
    
    if (input.length !== this.rootLayer.inputBuffer.length) {
        throw new Error('Wrong input dimensions');
    }
    if (output.length !== this.outputLayer.outputBuffer.length) {
        throw new Error('Wrong output dimensions');
    }
    
    var self = this,    
        connections,
        i,
        j,
        step = 0.2 + (Math.random > 0.5 ? 0.1 * Math.random() : - 0.1 * Math.random());
    
    this.resetLayers();
    this.forwardPropogate(input);

    // calculate the error
     
//    overallError = output.reduce(function (prevValue, currValue, index) {
//        return prevValue + (self.outputLayer.outputBuffer[index] - currValue);
//    }, 0);
//    console.log('error', overallError);
//    
//    overallError = overallError / this.outputLayer.outputBuffer.length;
//    
//    this.outputLayer.outputError = self.outputLayer.outputError.map(function (el, index) {
//        return overallError;
//    });
    
    for (i in this.forwardConnections) {
        if (this.forwardConnections.hasOwnProperty(i)) {
            this.forwardConnections[i].forEach(function (con) {
                con.resetDerivatives();
            });
        }
    }
    
    this.outputLayer.outputError = output.map(function (target, index) {
        return target - self.outputLayer.outputBuffer[index];
        //return 0;
    });
    
    console.log('OUTPUT BUFFER', this.outputLayer.outputBuffer);
    console.log('OUTPUT ERROR', this.outputLayer.outputError, 'Desired:', output);
    console.log('\n');
    
    this.backwardPropogate(output);
    

    for (i in this.forwardConnections) {
        if (this.forwardConnections.hasOwnProperty(i)) {
            connections = this.forwardConnections[i];

            connections.forEach(function (connection) {
                                
                if (connection.parameters.length !== connection.derivatives.length) {
                    throw new Error('Wrong derivative dims');
                }
                
                connection.resetDerivatives();
                
                //console.log('params - derivs', connection.parameters, '-', connection.derivatives.map(function (el) { return step * el; }));
                
                // TODO: Subtract?
                connection.parameters = connection.parameters.map(function (el, index) {
                    return  el + step * connection.derivatives[index];
                });
                
                //console.log('params after ds', connection.parameters);
            });
        }
    }

};


module.exports = {
    'Network': Network,
    'Layers': require('./layers'),
    'Neurons': require('./neurons'),
    'Connections': require('./connections')
};