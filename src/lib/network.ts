/*global module, require*/

function meanSquaredError(errors) {
    var mean = errors.reduce(function (prev, curr, index) {
        return prev + Math.pow(curr, 2);
    }, 0);
    return mean / errors.length;
}

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
    
    return this.outputLayer.outputBuffer;
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


Network.prototype.train = function (input, targetVector, options) {
    'use strict';
    
    if (input.length !== this.rootLayer.inputBuffer.length) {
        throw new Error('Wrong input dimensions');
    }
    if (targetVector.length !== this.outputLayer.outputBuffer.length) {
        throw new Error('Wrong output dimensions');
    }
    
    var self = this,
        connections,
        i,
        j,
        errorVector = [],
        options = options || {},
        step = options.step || 0.21,
        momentum = options.momentum || 0.1,
        dropout = options.dropout || 0.2;
    
    this.forEachConnection(function (con) {
        con.resetDerivatives();
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
            var calculatedStep, newParam;
            
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
    
};


module.exports = {
    'meanSquaredError': meanSquaredError,
    'Network': Network
};