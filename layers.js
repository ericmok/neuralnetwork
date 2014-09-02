/*global module, require*/

var neurons = require('./neurons');

/**
Instead of copying functions, we maintain an indirection to it instead
*/
function ifObjectThenCreateDefaultNeuron(obj) {
    'use strict';
    
    var key, // temp
        indirection;
    
    if (typeof obj === 'function') {
        return new obj();
    }
    
    indirection = new neurons.Neuron();
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            indirection[key] = obj[key];
        }
    }
    
    return indirection;
}


/**
Constructor to create a new layer of neurons
*/
function Layer() {
    'use strict';

    var i,
        args = Array.prototype.slice.call(arguments, 0);
    
    
    
    // Sensible args should be multiples of 2, yet a single arg might pass 
    if ((args.length === 0) ||
            (args.length % 2 !== 0 && args.length > 1)) {
        throw new Error("Arguments must be 1 or multiples of 2." +
                            "Example: new Layer(IdentityNeuron, 2, BiasNeuron, 1)");
    }

    this.neurons = [];
    
    this.createMixNeurons(args);
}

Layer.prototype.createMixNeurons = function (args) {
    'use strict';

    var i, j,
        neuronType = null;
    
    if (args.length > 1) {
        
        for (i = 0; i < args.length / 2; i += 1) {
            neuronType = ifObjectThenCreateDefaultNeuron(args[i * 2]);
            
            for (j = 0; j < args[i * 2 + 1]; j += 1) {
                this.neurons.push(neuronType);
            }
        }
    }
};

module.exports = {
    'Layer': Layer
};