/*global require, describe, expect, assert, it*/
'use strict';

var chai = require('chai'),
    assert = chai.assert,
    should = chai.should(),
    expect = chai.expect;

var network = require('./network'),
    Neurons = network.Neurons,
    Connections = network.Connections,
    Layers = network.Layers;

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

describe('Layers', function() {
    describe('Arguments', function() {
        it('should accept not accept odd number arguments more than 1', function(done) {
            expect( function() { 
                        return new network.Layers.Layer({}, 1, {});
                    } ).to.throw(Error);
            expect( function() { 
                        return new network.Layers.Layer();
                    } ).to.throw(Error);
            expect( function() { 
                        return new network.Layers.Layer({}, 1, {}, 2, {});
                    } ).to.throw(Error);
            done();
        });
        
        it('should accept even arguments at least', function(done) {
            expect( function() { 
                        return new network.Layers.Layer({}, 1, {}, 2);
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
            
            test = new network.Layers.Layer(network.Neurons.IdentityNeuron, 10, network.Neurons.BiasNeuron, 1);
            expect(test.neurons.length).to.be.equal(11);
            
            done();
        });
        
        it('can initialize neuron list with object interface', function(done) {
            var test = new network.Layers.Layer({
                forward: function(abc) { return 12; },
                backward: function(out) { return 12; }
            }, 10);
            
            expect(test.neurons.length).to.be.equal(10);
            expect(test.neurons[0].forward()).to.be.equal(12);
            expect(test.neurons[0].backward()).to.be.equal(12);
            
            var test = new network.Layers.Layer({
                forward: function(abc) { return 12; },
                backward: function(out) { return 12; }
            }, 10, network.Neurons.BiasNeuron, 22);
            
            expect(test.neurons.length).to.be.equal(32);
            expect(test.neurons[0].forward()).to.be.equal(12);
            
            done();
        });
        
        it('each neuron has a different name', function(done) {
            
            var lookup = {};
            
            var test = new network.Layers.Layer({
                forward: function(abc) { return 12; },
                backward: function(out) { return 12; }
            }, 5, network.Neurons.BiasNeuron, 2);
            
            // Cute uniqueness test! :D
            test.neurons.forEach(function(n) {
                expect(lookup[n.name]).to.be.undefined;
                lookup[n.name] = 1;
            });
            
            done();
        });
        
        it('can initialize inputbuffer outputbuffer inputerror outputerror', function(done) {
            var test = new network.Layers.Layer(network.Neurons.SigmoidNeuron, 10);
            expect(test.inputBuffer.length).to.be.equal(test.neurons.length);
            expect(test.outputBuffer.length).to.be.equal(test.neurons.length);
            expect(test.inputError.length).to.be.equal(test.neurons.length);
            expect(test.outputError.length).to.be.equal(test.neurons.length);
            
            done();
        });
    });
    
    describe('Propogation', function() {
        
        it('can forward', function(done) {
            var test = new network.Layers.Layer(network.Neurons.IdentityNeuron, 2);
            test.inputBuffer = [1, 1.1];
            test.forward();
            expect(test.outputBuffer[0]).to.be.equal( network.Neurons.IdentityNeuron.prototype.forward(test.inputBuffer[0]) );
            expect(test.outputBuffer[1]).to.be.equal( network.Neurons.IdentityNeuron.prototype.forward(test.inputBuffer[1]) );
            
            done();
        });
        
        it('can backward', function(done) {
            var test = new network.Layers.Layer(network.Neurons.IdentityNeuron, 2);
            test.outputError = [1, 1];
            test.backward();
            expect(test.inputError[0]).to.be.equal( network.Neurons.IdentityNeuron.prototype.backward(test.outputError[0]) );
            expect(test.inputError[1]).to.be.equal( network.Neurons.IdentityNeuron.prototype.backward(test.outputError[1]) );
            
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

describe('Connections', function() {
    describe('Help Functions', function() {
        it('can dot product', function(done) {
            expect(network.Connections.dotProduct([1, 1, 1], [1, 1, 1])).to.equal(3);
            
            // Floating point error
            expect(network.Connections.dotProduct([-1, 2.3, 3], [1.1, 0.1, 0])).to.equal(-0.8700000000000001);
            done();
        });
        
        it('can matrix vec multiply', function(done) {
            var result = network.Connections.matrixVectorMultiplication([0,0,0,0],[0,0]);
            expect(result[0]).to.be.equal(0);
            expect(result[1]).to.be.equal(0);
            expect(result.length).to.be.equal(2);
            
            result = network.Connections.matrixVectorMultiplication([1,2,3,4,5,6],[5.5, 4.5]);
            expect(result[0]).to.be.equal(1 * 5.5 + 2 * 4.5);
            expect(result[1]).to.be.equal(3 * 5.5 + 4 * 4.5);
            expect(result[2]).to.be.equal(5 * 5.5 + 6 * 4.5);
            expect(result.length).to.be.equal(3);
            
            result = network.Connections.matrixVectorMultiplication([1,2,3,4,5,6],[5.5, 4.5, 2.1]);
            expect(result[0]).to.be.equal(1 * 5.5 + 2 * 4.5  + 3 * 2.1);
            expect(result[1]).to.be.equal(4 * 5.5 + 5 * 4.5 + 6 * 2.1);
            expect(result.length).to.be.equal(2);
            
            done();
        });
        
        it('cannot matrix vec multiply with bad params', function(done) {
            expect(function() {
                return network.Connections.matrixVectorMultiplication([1,2,3],[5.5, 4.5]);
            }).to.throw(Error);
            
            expect(function() {
                return network.Connections.matrixVectorMultiplication([1,2,3, 4, 5],[5.5, 4.5]);
            }).to.throw(Error);
            
            done();
        });
        
        it('can transpose', function(done) {
            var result = network.Connections.transpose([1, 2, 3, 4], 2);
            expect(result[0]).to.be.equal(1);
            expect(result[1]).to.be.equal(3);
            expect(result[2]).to.be.equal(2);
            expect(result[3]).to.be.equal(4);
            expect(result.length).to.be.equal(4);
            
            result = network.Connections.transpose([1, 2, 3, 4, 5, 6], 2);
            expect(result[0]).to.be.equal(1);
            expect(result[1]).to.be.equal(3);
            expect(result[2]).to.be.equal(5);
            expect(result[3]).to.be.equal(2);
            expect(result[4]).to.be.equal(4);
            expect(result[5]).to.be.equal(6);
            expect(result.length).to.be.equal(6);
            
            done();
        });
        
        it('can dotproduct transposed matrices', function(done) {
            var mat = [1,2,3,4];
            var result = network.Connections.matrixVectorMultiplication(mat, [1,1]);
            expect(result[0]).to.be.equal(3);
            expect(result[1]).to.be.equal(7);
            
            expect(result.length).to.be.equal(2);
            
            // This time transpose the matrix
            result = network.Connections.matrixVectorMultiplication(network.Connections.transpose(mat, 2), [1,1]);
            expect(result[0]).to.be.equal(4);
            expect(result[1]).to.be.equal(6);
            
            expect(result.length).to.be.equal(2);
            
            
            done();
        });
    });
    
    describe('Constructor', function() {
        var inputLayer = new Layers.Layer(Neurons.IdentityNeuron, 2, Neurons.BiasNeuron, 1);
        var outputLayer = new Layers.Layer(Neurons.IdentityNeuron, 2);
        
        it('has right # params', function(done) {
            var connection = new Connections.FullConnection(inputLayer, outputLayer);
        
            expect(connection.parameters.length).to.be.equal(inputLayer.neurons.length * outputLayer.neurons.length);
                
            done();
        });
    });
    
    describe('Connection State', function() {
        var inputLayer = new Layers.Layer(Neurons.IdentityNeuron, 2);
        var outputLayer = new Layers.Layer(Neurons.IdentityNeuron, 2);
            
        it('can zero parameters', function(done) {
            var con = new Connections.FullConnection(inputLayer, outputLayer);
            con.zeroParameters();

            expect(con.parameters[0]).to.be.equal(0);
            expect(con.parameters[1]).to.be.equal(0);
                   
            done();
        });
    });
    
    describe('Propogation', function() {
        var inputLayer = new Layers.Layer(Neurons.IdentityNeuron, 2, Neurons.BiasNeuron, 1);
        var outputLayer = new Layers.Layer(Neurons.IdentityNeuron, 2);
        var connection = new Connections.FullConnection(inputLayer, outputLayer);
        connection.parameters = [1.1, 1, 1, 0, 0, 0];    
        
        it('can forward', function(done) {
    
            inputLayer.inputBuffer = [1, 2, 3];
            inputLayer.forward();
            connection.forward();
            outputLayer.forward();

            expect(outputLayer.inputBuffer.length).to.be.equal(2);
            
            // Mind the bias unit - it creates a 1 instead of a 3
            expect(outputLayer.inputBuffer[0]).to.be.equal(1.1*1 + 2 + 1);
            expect(outputLayer.inputBuffer[1]).to.be.equal(0);
            
            expect(outputLayer.outputBuffer[0]).to.be.equal(1.1*1 + 2 + 1);
            expect(outputLayer.outputBuffer[1]).to.be.equal(0);
            
            done();
        });
        
        it('can backward', function(done) {
            outputLayer.outputError = [2, 2.5];
            
           //console.log(inputLayer);
           //console.log(outputLayer);
            
            outputLayer.backward();
            connection.backward();
            inputLayer.backward();
            
            expect(outputLayer.inputError.length).to.be.equal(2);
            expect(outputLayer.inputError[0]).to.be.equal(2);
            expect(outputLayer.inputError[1]).to.be.equal(2.5);
            
            expect(inputLayer.outputError.length).to.be.equal(3);
            expect(inputLayer.outputError[0]).to.be.equal(2 * 1.1 + 2.5 * 0);
            expect(inputLayer.outputError[1]).to.be.equal(2 * 1 + 2.5 * 0);
            expect(inputLayer.outputError[2]).to.be.equal(2 * 1 + 2.5 * 0);
             
            done();
        });
    });
});
