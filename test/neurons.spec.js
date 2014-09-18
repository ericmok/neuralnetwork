/*global require, describe, expect, assert, it*/
'use strict';

var chai = require('chai'),
    assert = chai.assert,
    should = chai.should(),
    expect = chai.expect;

var network = require('../lib/network'),
    Neurons = network.Neurons,
    Connections = network.Connections,
    Layers = network.Layers;

describe('Test', function() {
    it('works', function(done) {
        assert.equal(true, true);
        done();
    });
    it('can load modules', function(done) {
        expect(network.Layer).to.be.undefined;
        expect(network.Layers).to.not.be.undefined;
        expect(network.Neurons).to.not.be.undefined;
        expect(network.Connections).to.not.be.undefined;
        done();
    });
});

describe('Neurons', function() {
    describe('Basic instantiations', function() {
        it('Identity Neuron works', function() {
            expect((new Neurons.IdentityNeuron()).forward(1)).to.equal(1);
            expect((new Neurons.IdentityNeuron()).forward(5)).to.equal(5);
        });
        it('Bias Neuron works', function() {
            expect((new Neurons.BiasNeuron()).forward(12)).to.equal(1);
        });
        it('Sigmoid Neuron works', function() {
            var n = new Neurons.SigmoidNeuron();
            var result = n.forward(2);
            
            expect(result).to.equal(1.0 / (1.0 + Math.exp(-2)));
            
            var backResult = n.backward(2, result); // args: err, output
            expect(backResult).to.equal(result * (1 - result) * 2);
        });
        it('RectifiedLinear Neuron works', function() {
            expect((new Neurons.RectifiedLinearNeuron()).forward(2)).to.equal(2);
            expect((new Neurons.RectifiedLinearNeuron()).forward(-1)).to.equal(0);
            
            expect((new Neurons.RectifiedLinearNeuron()).backward(2, 1)).to.equal(2);
            expect((new Neurons.RectifiedLinearNeuron()).backward(2, -1)).to.equal(0);
        });
    });

});
