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


describe('Connections', function() {
    
    describe('Help Functions', function() {
        
        it('can dot product', function(done) {
            expect(Connections.dotProduct([1, 1, 1], [1, 1, 1])).to.equal(3);
            
            // Floating point error
            expect(Connections.dotProduct([-1, 2.3, 3], [1.1, 0.1, 0])).to.equal(-0.8700000000000001);
            done();
        });
        
        it('can vector sum', function(done) {
            var test = Connections.vectorSum([1,2,3], [4,5,6]);
            expect(test[0]).to.equal(5);
            expect(test[1]).to.equal(7);
            expect(test[2]).to.equal(9);
            
            test = Connections.vectorSum([1,2,3, 4], [4,5,6]);
            expect(test[0]).to.equal(5);
            expect(test[1]).to.equal(7);
            expect(test[2]).to.equal(9);
            expect(test[3]).to.equal(4);
            
            test = Connections.vectorSum([1,2,3], [4,5,6, 6]);
            expect(test[0]).to.equal(5);
            expect(test[1]).to.equal(7);
            expect(test[2]).to.equal(9);
            expect(test[3]).to.equal(6);
            
            done();
        });
        
        it('can matrix vec multiply', function(done) {
            var result = Connections.matrixVectorMultiplication([0,0,0,0],[0,0]);
            expect(result[0]).to.be.equal(0);
            expect(result[1]).to.be.equal(0);
            expect(result.length).to.be.equal(2);
            
            result = Connections.matrixVectorMultiplication([1,2,3,4,5,6],[5.5, 4.5]);
            expect(result[0]).to.be.equal(1 * 5.5 + 2 * 4.5);
            expect(result[1]).to.be.equal(3 * 5.5 + 4 * 4.5);
            expect(result[2]).to.be.equal(5 * 5.5 + 6 * 4.5);
            expect(result.length).to.be.equal(3);
            
            result = Connections.matrixVectorMultiplication([1,2,3,4,5,6],[5.5, 4.5, 2.1]);
            expect(result[0]).to.be.equal(1 * 5.5 + 2 * 4.5  + 3 * 2.1);
            expect(result[1]).to.be.equal(4 * 5.5 + 5 * 4.5 + 6 * 2.1);
            expect(result.length).to.be.equal(2);
            
            done();
        });
        
        it('cannot matrix vec multiply with bad params', function(done) {
            expect(function() {
                return Connections.matrixVectorMultiplication([1,2,3],[5.5, 4.5]);
            }).to.throw(Error);
            
            expect(function() {
                return Connections.matrixVectorMultiplication([1,2,3, 4, 5],[5.5, 4.5]);
            }).to.throw(Error);
            
            done();
        });
        
        it('can transpose', function(done) {
            var result = Connections.transpose([1, 2, 3, 4], 2);
            expect(result[0]).to.be.equal(1);
            expect(result[1]).to.be.equal(3);
            expect(result[2]).to.be.equal(2);
            expect(result[3]).to.be.equal(4);
            expect(result.length).to.be.equal(4);
            
            result = Connections.transpose([1, 2, 3, 4, 5, 6], 2);
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
            var result = Connections.matrixVectorMultiplication(mat, [1,1]);
            expect(result[0]).to.be.equal(3);
            expect(result[1]).to.be.equal(7);
            
            expect(result.length).to.be.equal(2);
            
            // This time transpose the matrix
            result = Connections.matrixVectorMultiplication(Connections.transpose(mat, 2), [1,1]);
            expect(result[0]).to.be.equal(4);
            expect(result[1]).to.be.equal(6);
            
            expect(result.length).to.be.equal(2);
            
            
            done();
        });
        
        it('can zero out vectors', function(done) {
            var vec = [1,2,3,4];
            var result = Connections.zero(vec);
            
            expect(vec[0]).to.be.equal(0);
            expect(vec[1]).to.be.equal(0);
            expect(vec[2]).to.be.equal(0);
            expect(vec[3]).to.be.equal(0);
            
            // Should this be Immutable?
            expect(result[0]).to.be.equal(0);
            expect(result[1]).to.be.equal(0);
            expect(result[2]).to.be.equal(0);
            expect(result[3]).to.be.equal(0);
            
            done();
        });
        
        it('can outer product', function(done) {
            var result = Connections.outerProduct([1,2,3],[1,2]);
            
            expect(result.length).to.be.equal(6);
            expect(result[0]).to.be.equal(1);
            expect(result[1]).to.be.equal(2);
            expect(result[2]).to.be.equal(2);
            expect(result[3]).to.be.equal(4);
            expect(result[4]).to.be.equal(3);
            expect(result[5]).to.be.equal(6);
            
            var result = Connections.outerProduct([0, 0], [0, 1]);
            
            expect(result.length).to.be.equal(4);
            expect(result[0]).to.be.equal(0);
            expect(result[1]).to.be.equal(0);
            expect(result[2]).to.be.equal(0);
            expect(result[3]).to.be.equal(0);
            
            done();
        });

    });
    
    describe('Connection Constructor', function() {
        var inputLayer = new Layers.Layer(Neurons.IdentityNeuron, 2, Neurons.BiasNeuron, 1);
        var outputLayer = new Layers.Layer(Neurons.IdentityNeuron, 2);
        
        it('has right # params', function(done) {
            var connection = new Connections.FullConnection(inputLayer, outputLayer);
        
            expect(connection.parameters.length).to.be.equal(inputLayer.neurons.length * outputLayer.neurons.length);
            
            done();
        });
        
        it('has input and output layers', function(done) {
            var connection = new Connections.FullConnection(inputLayer, outputLayer);
        
            expect(connection.inputLayer).to.not.be.undefined;
            expect(connection.outputLayer).to.not.be.undefined;
            
            done();
        });
        
    });
    
    describe('Connection State', function() {
        var inputLayer = new Layers.Layer(Neurons.IdentityNeuron, 2);
        var outputLayer = new Layers.Layer(Neurons.IdentityNeuron, 2);
            
        it('can zero parameters', function(done) {
            var con = new Connections.FullConnection(inputLayer, outputLayer);
            con.resetParameters();

            expect(con.parameters[0]).to.be.equal(0);
            expect(con.parameters[1]).to.be.equal(0);
            
            done();
        });
        
        it('can set params to 1 using resetParameters()', function(done) {
            var con = new Connections.FullConnection(inputLayer, outputLayer);
            
            con.resetParameters(1);
            expect(con.parameters[0]).to.be.equal(1);
            expect(con.parameters[1]).to.be.equal(1);
            
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
             
            // TODO: expand this test
            expect(connection.derivatives.length).to.be.equal(connection.parameters.length);
            
            done();
        });
    });
});

