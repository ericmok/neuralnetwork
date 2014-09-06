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
};

Network.prototype.setOutputLayer = function (layer) {
    'use strict';
    
    this.outputLayer = layer;
};

Network.prototype.addConnection = function (con) {
    'use strict';
    
    this.forwardConnections[con.inputLayer.name] = this.forwardConnections[con.inputLayer.name] || [];
    this.forwardConnections[con.inputLayer.name].push(con);

    this.backwardConnections[con.outputLayer.name] = this.backwardConnections[con.outputLayer.name] || [];
    this.backwardConnections[con.outputLayer.name].push(con);
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
            connections.backward();
            openSet.push(connection.inputLayer);
        });
    }
    
    
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



module.exports = {
    'Network': Network,
    'Layers': require('./layers'),
    'Neurons': require('./neurons'),
    'Connections': require('./connections')
};