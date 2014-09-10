/*global module*/


(function () {

    'use strict';
    
    var key; // Temp variable for copying keys in a loop
    
    /**
    * Neural models for layers.
    * Should contain a name and both forward and backward interfaces
    */
    function Neuron() {
        this.name = Math.random().toString(36).substring(2);
    }

    Neuron.prototype.forward = function (input) {
        return input;
    };

    Neuron.prototype.backward = function (error) {
        return error;
    };

    
    function IdentityNeuron() {
        Neuron.prototype.constructor.apply(this, arguments);
    }
    
    for (key in Neuron.prototype) {
        if (Neuron.prototype.hasOwnProperty(key)) {
            IdentityNeuron.prototype[key] = Neuron.prototype[key];
        }
    }

    
    function BiasNeuron() {
        Neuron.prototype.constructor.apply(this, arguments);
    }
    
    BiasNeuron.prototype.forward = function () {
        return 1;
    };
    
    /**
    Nothing is backpropogated
    */
    BiasNeuron.prototype.backward = function () {
        return 0;
    };
    
    
    function SigmoidNeuron() {
        Neuron.prototype.constructor.apply(this, arguments);
    }
    
    SigmoidNeuron.prototype.forward = function (input) {
        return 1.0 / (1.0 + Math.exp(-input));
    };
    
    // Output is the activation value created by forward
    SigmoidNeuron.prototype.backward = function (err, output) {
        return output * (1 - output) * err;
    };
        
    function RectifiedLinearNeuron() {
        Neuron.prototype.constructor.apply(this, arguments);
    }
    
    RectifiedLinearNeuron.prototype.forward = function (input) {
        return Math.max(0, input);
    };
    
    RectifiedLinearNeuron.prototype.backward = function (err, output) {
        return ((output > 0) ? err : 0);
    };
    
    module.exports = {
        'Neuron': Neuron,
        'IdentityNeuron': IdentityNeuron,
        'BiasNeuron': BiasNeuron,
        'SigmoidNeuron': SigmoidNeuron,
        'RectifiedLinearNeuron': RectifiedLinearNeuron
    };
}());

