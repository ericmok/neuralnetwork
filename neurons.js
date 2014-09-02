/*global module*/


(function () {

    'use strict';

    /**
    Neural models for layers.
    Should contain both forward and backward interfaces
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


    function BiasNeuron() {
        Neuron.prototype.constructor.apply(this, arguments);
    }
    
    BiasNeuron.prototype.forward = function (input) {
        return 1;
    };
    
    BiasNeuron.prototype.backward = function (error) {
        return 1;
    };
    
    
    module.exports = {
        'Neuron': Neuron,
        'IdentityNeuron': IdentityNeuron
    };
}());

