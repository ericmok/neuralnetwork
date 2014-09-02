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
    
    BiasNeuron.prototype.backward = function () {
        return 1;
    };
    
    
    module.exports = {
        'Neuron': Neuron,
        'IdentityNeuron': IdentityNeuron,
        'BiasNeuron': BiasNeuron
    };
}());

