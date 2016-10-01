/*global require, describe, expect, assert, it*/
'use strict';

var chai = require('chai'),
    assert = chai.assert,
    should = chai.should(),
    expect = chai.expect;

var neuralNet = require('../lib/main'),
    Neurons = neuralNet.neurons,
    Connections = neuralNet.connections,
    Layers = neuralNet.layers;

describe('Test', function() {
    it('works', function(done) {
        assert.equal(true, true);
        done();
    });
    it('can load modules', function(done) {
        expect(neuralNet.neurons).to.not.be.undefined;
        expect(neuralNet.connections).to.not.be.undefined;
        expect(neuralNet.layers).to.not.be.undefined;
        done();
    });
});


describe('Connections', function() {

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
