/*global module, require*/

var neurons = require('./neurons');

/**
Instead of copying functions, we maintain an indirection to it instead
*/
function ifObjectThenCreateDefaultNeuron(obj) {
    'use strict';
    
    var key, // temp
        indirection,
        ret;
    
    if (typeof obj === 'function') {
        ret = new obj();
        return ret;
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

    this.name = Math.random().toString(36).substring(2);
    
    this.neurons = [];
    
    if (args.length > 1) {
        this.createMixNeurons(args);
    }
    
    this.inputBuffer = [];
    this.outputBuffer = [];
    this.inputError = [];
    this.outputError = [];
    
    this.resetBuffers();
}

Layer.prototype.resetBuffers = function () {
    'use strict';
    var i;
    
    for (i = 0; i < this.neurons.length; i += 1) {
        this.inputBuffer[i] = 0;
        this.outputBuffer[i] = 0;
        this.inputError[i] = 0;
        this.outputError[i] = 0;
    }
};

Layer.prototype.createMixNeurons = function (args) {
    'use strict';

    var i, j,
        neuronType = null;
        
    for (i = 0; i < args.length / 2; i += 1) {
    
        for (j = 0; j < args[i * 2 + 1]; j += 1) {
            neuronType = ifObjectThenCreateDefaultNeuron(args[i * 2]);
            this.neurons.push(neuronType);
        }
    }
};

Layer.prototype.forward = function () {
    'use strict';

    var self = this;
    
    this.neurons.forEach(function (el, index, arr) {
        self.outputBuffer[index] = el.forward(self.inputBuffer[index]);
    });
    
};

Layer.prototype.backward = function () {
    'use strict';
    
    var self = this;
    
    this.neurons.forEach(function (el, index, arr) {
        self.inputError[index] = el.backward(self.outputError[index]);
    });
    
};

module.exports = {
    'Layer': Layer
};