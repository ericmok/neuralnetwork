/*global require, describe, expect, assert, it*/
'use strict';

var chai = require('chai'),
    assert = chai.assert,
    should = chai.should(),
    expect = chai.expect;

var network = require('./network');

describe('Test', function() {
    it('works', function(done) {
        assert.equal(true, true);
        done();
    });
    it('can load network', function(done) {
        expect(network.Layer).to.be.undefined;
        expect(network.Layers).to.not.be.undefined;
        expect(network.Neurons).to.not.be.undefined;
        done();
    });
});

describe('Layer', function() {
    describe('Arguments', function() {
        it('should accept not accept odd number arguments more than 1', function(done) {
            expect( function() { 
                        return new network.Layers.Layer({}, 1, {}) 
                    } ).to.throw(Error);
            expect( function() { 
                        return new network.Layers.Layer() 
                    } ).to.throw(Error);
            expect( function() { 
                        return new network.Layers.Layer({}, 1, {}, 2, {}) 
                    } ).to.throw(Error);
            done();
        });
        
        it('should accept even arguments at least', function(done) {
            expect( function() { 
                        return new network.Layers.Layer({}, 1, {}, 2) 
                    } ).to.not.throw(Error);
            done();
        });
        
        it('can initialize neuron list with default neurons', function(done) {
            var test = new network.Layers.Layer(network.Neurons.IdentityNeuron, 10);
            expect(test.neurons.length).to.be.equal(10);
            
            test = new network.Layers.Layer(network.Neurons.BiasNeuron, 1);
            expect(test.neurons.length).to.be.equal(1);
            
            done();
        });
        
        it('can initialize neuron list', function(done) {
            var test = new network.Layers.Layer(network.Neurons.IdentityNeuron, 10);
            expect(test.neurons.length).to.be.equal(10);    
            done();
        });
        
        it('can initialize neuron list with object interface', function(done) {
            var test = new network.Layers.Layer({
                forward: function(abc) { return 12; },
                backward: function(out) { return 12; }
            }, 10);
            
            expect(test.neurons.length).to.be.equal(10);
            expect(test.neurons[0].forward()).to.be.equal(12);
            
            done();
        });
    });
    
});

describe('Neurons', function() {
    describe('Basic instantiations', function() {
        it('Identity Neuron works', function() {
            expect((new network.Neurons.IdentityNeuron()).forward(1)).to.equal(1);
            expect((new network.Neurons.IdentityNeuron()).forward(5)).to.equal(5);
        });
        it('Bias Neuron works', function() {
            expect((new network.Neurons.BiasNeuron()).forward(12)).to.equal(1);
        });
    });

});