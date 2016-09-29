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

describe('Network', function() {

    describe('Structure', function() {

        describe('can set root layer and output layer', function() {
            var net = new neuralNet.Network();
            var inputLayer = new Layers.Layer(Neurons.IdentityNeuron, 2);
            var hiddenLayer = new Layers.Layer(Neurons.IdentityNeuron, 2);
            var outputLayer = new Layers.Layer(Neurons.IdentityNeuron, 2);

            it('can set root and output layer', function(done) {
                net.setRootLayer(inputLayer);
                net.setOutputLayer(outputLayer);

                expect(net.rootLayer).to.be.not.undefined;
                expect(net.outputLayer).to.be.not.undefined;

                done();
            });

        });

        describe('Layer hash', function() {
            var net = new neuralNet.Network();
            var inputLayer = new Layers.Layer(Neurons.IdentityNeuron, 2);
            var hiddenLayer = new Layers.Layer(Neurons.IdentityNeuron, 2);
            var outputLayer = new Layers.Layer(Neurons.IdentityNeuron, 2);


            it('updates when input and output layer are set', function(done) {
                net.setRootLayer(inputLayer);
                net.setOutputLayer(outputLayer);

                expect(Object.keys(net.layers).length).to.be.equal(2);
                done();
            });

            it('updates when layers are explicitly added', function(done) {
                var currentNumberLayers = Object.keys(net.layers).length;

                net.addLayer(hiddenLayer);
                expect(Object.keys(net.layers).length).to.be.equal(currentNumberLayers + 1);

                done();
            });

            it('updates when connections are added', function(done) {
                var net = new neuralNet.Network();
                var inputLayer = new Layers.Layer(Neurons.IdentityNeuron, 2);
                var hiddenLayer = new Layers.Layer(Neurons.IdentityNeuron, 2);
                var outputLayer = new Layers.Layer(Neurons.IdentityNeuron, 2);

                var currentNumberLayers = Object.keys(net.layers).length;
                var con = new Connections.FullConnection(inputLayer, hiddenLayer);

                net.addConnection(con);

                expect(Object.keys(net.layers).length).to.be.equal(currentNumberLayers + 2);

                done();
            });
        });

        it('can add connection', function(done) {
            var net = new neuralNet.Network();
            var inputLayer = new Layers.Layer(Neurons.IdentityNeuron, 2);
            var hiddenLayer = new Layers.Layer(Neurons.IdentityNeuron, 2);
            var outputLayer = new Layers.Layer(Neurons.IdentityNeuron, 2);

            var ihConnection = new Connections.FullConnection(inputLayer, hiddenLayer);
            var hoConnection = new Connections.FullConnection(hiddenLayer, outputLayer);

            ihConnection.resetParameters(1);
            hoConnection.resetParameters(1);

            net.addConnection(ihConnection);
            net.addConnection(hoConnection);

            expect(Object.keys(net.forwardConnections).length).to.be.equal(2);
            expect(Object.keys(net.backwardConnections).length).to.be.equal(2);

            expect(net.forwardConnections[inputLayer.name].length).to.be.equal(1);
            expect(net.forwardConnections[hiddenLayer.name].length).to.be.equal(1);

            expect(net.forwardConnections[inputLayer.name][0]).to.be.equal(ihConnection);
            expect(net.forwardConnections[hiddenLayer.name][0]).to.be.equal(hoConnection);

            done();
        });

    });

    describe('Network Propogation', function() {
        var net = new neuralNet.Network();
        var inputLayer = new Layers.Layer(Neurons.IdentityNeuron, 2);
        var hiddenLayer = new Layers.Layer(Neurons.IdentityNeuron, 2);
        var outputLayer = new Layers.Layer(Neurons.IdentityNeuron, 2);

        var ihConnection = new Connections.FullConnection(inputLayer, hiddenLayer);
        var hoConnection = new Connections.FullConnection(hiddenLayer, outputLayer);

        ihConnection.resetParameters(1);
        hoConnection.resetParameters(1);

        it('can forward propogate', function(done) {
            net.setRootLayer(inputLayer);
            net.setOutputLayer(outputLayer);
            net.addConnection(ihConnection);
            net.addConnection(hoConnection);

            expect(Object.keys(net.forwardConnections).length).to.be.equal(2);

            net.forwardPropogate([1,1]);

            expect(net.outputLayer.outputBuffer.length).to.be.equal(2);
            expect(net.outputLayer.outputBuffer[0]).to.be.equal(4);
            expect(net.outputLayer.outputBuffer[0]).to.be.equal(4);

            net.resetLayers();
            net.forwardPropogate([1,2]);

            expect(net.outputLayer.outputBuffer.length).to.be.equal(2);
            expect(net.outputLayer.outputBuffer[0]).to.be.equal(6);
            expect(net.outputLayer.outputBuffer[0]).to.be.equal(6);

            done();
        });

        it('forward propogate returns outputbuffer', function(done) {
            net.resetLayers();
            var result = net.forwardPropogate([1,2]);

            expect(result.length).to.be.equal(2);
            expect(result[0]).to.be.equal(6);
            expect(result[0]).to.be.equal(6);

            done();
        });

        it('can backward propogate', function(done) {
            net.resetLayers();
            net.forwardPropogate([1,1]);
            net.backwardPropogate([1,1]);

            var inErr = net.rootLayer.inputError;
            expect(inErr[0]).to.be.equal(4);
            expect(inErr[1]).to.be.equal(4);


            var derivs = ihConnection.derivatives;

            expect(derivs.length).to.be.equal(4);
            expect(derivs[0]).to.be.equal(ihConnection.outputLayer.inputError[0] * ihConnection.inputLayer.outputBuffer[0]);
            expect(derivs[1]).to.be.equal(ihConnection.outputLayer.inputError[1] * ihConnection.inputLayer.outputBuffer[0]);
            expect(derivs[2]).to.be.equal(ihConnection.outputLayer.inputError[0] * ihConnection.inputLayer.outputBuffer[1]);
            expect(derivs[3]).to.be.equal(ihConnection.outputLayer.inputError[1] * ihConnection.inputLayer.outputBuffer[1]);

            derivs = hoConnection.derivatives;
            expect(derivs.length).to.be.equal(4);
            expect(derivs[0]).to.be.equal(2);
            expect(derivs[1]).to.be.equal(2);
            expect(derivs[2]).to.be.equal(2);
            expect(derivs[3]).to.be.equal(2);

            net.resetLayers();
            net.forwardPropogate([1,1]);
            net.backwardPropogate([0,1]); // test was 1,1, but need to test asymmetric case

            var inErr = net.rootLayer.inputError;
            expect(inErr[0]).to.be.equal(2);
            expect(inErr[1]).to.be.equal(2);


            // ATTENTION! IF THE WEIGHTS ARE THE SAME, THE ERRORS ARE THE SAME!!!1111
            derivs = ihConnection.derivatives;

            expect(derivs.length).to.be.equal(4);
            expect(derivs[0]).to.be.equal(ihConnection.outputLayer.inputError[0] * ihConnection.inputLayer.outputBuffer[0]);
            expect(derivs[1]).to.be.equal(ihConnection.outputLayer.inputError[1] * ihConnection.inputLayer.outputBuffer[0]);
            expect(derivs[2]).to.be.equal(ihConnection.outputLayer.inputError[0] * ihConnection.inputLayer.outputBuffer[1]);
            expect(derivs[3]).to.be.equal(ihConnection.outputLayer.inputError[1] * ihConnection.inputLayer.outputBuffer[1]);

            derivs = ihConnection.derivatives;
            expect(derivs.length).to.be.equal(4);
            expect(derivs[0]).to.be.equal(1);
            expect(derivs[1]).to.be.equal(1);
            expect(derivs[2]).to.be.equal(1);
            expect(derivs[3]).to.be.equal(1);


            derivs = hoConnection.derivatives;
            expect(derivs.length).to.be.equal(4);
            expect(derivs[0]).to.be.equal(0);
            expect(derivs[1]).to.be.equal(0);
            expect(derivs[2]).to.be.equal(2);
            expect(derivs[3]).to.be.equal(2);

            // Make sure when error is 0 the derivs are zero
            derivs = hoConnection.derivatives;
            net.resetLayers();
            net.backwardPropogate([0,0]);
            expect(hoConnection.inputLayer.inputError[0]).to.be.equal(0);

            expect(derivs.length).to.be.equal(4);
            expect(derivs[0]).to.be.equal(0);
            expect(derivs[1]).to.be.equal(0);
            expect(derivs[2]).to.be.equal(0);
            expect(derivs[3]).to.be.equal(0);

            derivs = ihConnection.derivatives;
            net.resetLayers();
            net.backwardPropogate([0,0]);
            expect(derivs.length).to.be.equal(4);
            expect(derivs[0]).to.be.equal(0);
            expect(derivs[1]).to.be.equal(0);
            expect(derivs[2]).to.be.equal(0);
            expect(derivs[3]).to.be.equal(0);

            done();
        });

        it('can loop through connections', function(done) {
            var counter = 0;

            net.forEachConnection(function(con) {
                counter += 1;
                expect(con.inputLayer).to.not.be.undefined;
                expect(con.outputLayer).to.not.be.undefined;
            });

            expect(counter).to.be.equal(2);

            done();
        });


        it('can meanSquaredError', function(done) {
            expect(neuralNet.meanSquaredError([-2,3])).to.be.equal((4 + 9) / 2);
            expect(neuralNet.meanSquaredError([1,1])).to.be.equal(1);

            done();
        });

        it('can train', function(done) {
            var i, initialError, finalError;

            ihConnection.parameters = ihConnection.parameters.map(function(el) {
                return Math.random();
            });
            hoConnection.parameters = hoConnection.parameters.map(function(el) {
                return Math.random();
            });

            initialError = net.train([1,1], [-1,1]);
            for (i = 0; i < 100; i += 1) {
                net.resetLayers();
                finalError = net.train([1,1], [-1,1]);
                //console.log('\n output', net.outputLayer.outputBuffer, '\n\n');
            }

            net.resetLayers();
            net.forwardPropogate([1,1]);
            console.log('FINAL:', net.outputLayer.outputBuffer);
            console.log(['Expected:[',-1,',',1,']'].join(' '));
            expect(net.outputLayer.outputBuffer[0]).to.be.below(0);
            expect(net.outputLayer.outputBuffer[1]).to.be.above(0);

            expect(finalError).to.be.below(initialError);

            done();
        });

        it('can train AND task with momentum option (not a great test)', function(done) {

            var net = new neuralNet.Network();
            var inputLayer = new Layers.Layer(Neurons.IdentityNeuron, 2);
            var hiddenLayer = new Layers.Layer(Neurons.SigmoidNeuron, 4, Neurons.BiasNeuron, 1);
            var outputLayer = new Layers.Layer(Neurons.SigmoidNeuron, 1);

            var ihConnection = new Connections.FullConnection(inputLayer, hiddenLayer);
            var hoConnection = new Connections.FullConnection(hiddenLayer, outputLayer);

            ihConnection.parameters = ihConnection.parameters.map(function(el) {
                return Math.random();
            });
            hoConnection.parameters = hoConnection.parameters.map(function(el) {
                return Math.random();
            });

            net.setRootLayer(inputLayer);
            net.setOutputLayer(outputLayer);
            net.addConnection(ihConnection);
            net.addConnection(hoConnection);

            var initialError = 0, finalError = 0;
            var initialResults = [];

            net.resetLayers();
            initialResults.push(net.forwardPropogate([0,0]));
            net.resetLayers();
            initialResults.push(net.forwardPropogate([0,1]));
            net.resetLayers();
            initialResults.push(net.forwardPropogate([1,0]));
            net.resetLayers();
            initialResults.push(net.forwardPropogate([1,1]));

            console.log('Initial Results:', initialResults);

            initialError += net.train([0,0], [0], {momentum: 0.1});
            initialError += net.train([0,1], [0], {momentum: 0.1});
            initialError += net.train([1,0], [0], {momentum: 0.1});
            initialError += net.train([1,1], [1], {momentum: 0.1});

            initialError /= 4;

            console.log('inital error: ', initialError);

            for (var i = 0; i < 1300; i += 1) {
                finalError += net.train([0,0], [0], {momentum: 0.3});
                finalError += net.train([0,1], [0], {momentum: 0.3});
                finalError += net.train([1,0], [0], {momentum: 0.3});
                finalError += net.train([1,1], [1], {momentum: 0.3});
            }

            finalError /= (1300 * 4);
            console.log('final error: ', finalError);

            net.resetLayers();
            net.forwardPropogate([1,1]);
            console.log('FINAL: [1,1]=>[1] and got: ', net.outputLayer.outputBuffer);
            expect(net.outputLayer.outputBuffer[0]).to.be.above(0.6);

            net.resetLayers();
            net.forwardPropogate([0,0]);
            console.log('FINAL: [0,0]=>[0] and got: ', net.outputLayer.outputBuffer);
            expect(net.outputLayer.outputBuffer[0]).to.be.below(0.4);

            net.resetLayers();
            net.forwardPropogate([0,1]);
            console.log('FINAL: [0,1]=>[0] and got: ', net.outputLayer.outputBuffer);
            expect(net.outputLayer.outputBuffer[0]).to.be.below(0.4);

            net.resetLayers();
            net.forwardPropogate([1,0]);
            console.log('FINAL: [1,0]=>[0] and got: ', net.outputLayer.outputBuffer);
            expect(net.outputLayer.outputBuffer[0]).to.be.below(0.4);

            expect(finalError).to.be.below(initialError);

            done();
        });

        it('can train AND task with dropout option (not a great test)', function(done) {
            var initialError, finalError;

            var net = new neuralNet.Network();
            var inputLayer = new Layers.Layer(Neurons.IdentityNeuron, 2);
            var hiddenLayer = new Layers.Layer(Neurons.SigmoidNeuron, 4, Neurons.BiasNeuron, 1);
            var outputLayer = new Layers.Layer(Neurons.SigmoidNeuron, 1);

            var ihConnection = new Connections.FullConnection(inputLayer, hiddenLayer);
            var hoConnection = new Connections.FullConnection(hiddenLayer, outputLayer);

            ihConnection.parameters = ihConnection.parameters.map(function(el) {
                return Math.random();
            });
            hoConnection.parameters = hoConnection.parameters.map(function(el) {
                return Math.random();
            });

            net.setRootLayer(inputLayer);
            net.setOutputLayer(outputLayer);
            net.addConnection(ihConnection);
            net.addConnection(hoConnection);

            var initialResults = [];

            net.resetLayers();
            initialResults.push(net.forwardPropogate([0,0]));
            net.resetLayers();
            initialResults.push(net.forwardPropogate([0,1]));
            net.resetLayers();
            initialResults.push(net.forwardPropogate([1,0]));
            net.resetLayers();
            initialResults.push(net.forwardPropogate([1,1]));

            console.log('Initial Results:', initialResults);

            initialError = 0;
            initialError += net.train([0,0], [0], {dropout: 0.1});
            initialError += net.train([0,1], [0], {dropout: 0.1});
            initialError += net.train([1,0], [0], {dropout: 0.1});
            initialError += net.train([1,1], [1], {dropout: 0.1});
            initialError /= 4;

            console.log('inital error: ', initialError);


            finalError = 0;

            for (var i = 0; i < 1300; i += 1) {
                finalError += net.train([0,0], [0], {dropout: 0.2});
                finalError += net.train([0,1], [0], {dropout: 0.2});
                finalError += net.train([1,0], [0], {dropout: 0.2});
                finalError += net.train([1,1], [1], {dropout: 0.2});
            }

            finalError /= (1300 * 4);

            console.log('final error: ', finalError);

            net.resetLayers();
            net.forwardPropogate([1,1]);
            console.log('FINAL: [1,1]=>[1] and got:', net.outputLayer.outputBuffer);
            expect(net.outputLayer.outputBuffer[0]).to.be.above(0.6);

            net.resetLayers();
            net.forwardPropogate([0,0]);
            console.log('FINAL: [0,0]=>[0] and got: ', net.outputLayer.outputBuffer);
            expect(net.outputLayer.outputBuffer[0]).to.be.below(0.4);

            net.resetLayers();
            net.forwardPropogate([0,1]);
            console.log('FINAL: [0,1]=>[0] and got: ', net.outputLayer.outputBuffer);
            expect(net.outputLayer.outputBuffer[0]).to.be.below(0.4);

            net.resetLayers();
            net.forwardPropogate([1,0]);
            console.log('FINAL: [1,0]=>[0] and got: ', net.outputLayer.outputBuffer);
            expect(net.outputLayer.outputBuffer[0]).to.be.below(0.4);

            expect(finalError).to.be.below(initialError);

            done();
        });

        // This test is for fun
        it('can train XOR task with rectified linear neurons for hidden layer', function(done) {
            var initialError, finalError;

            var net = new neuralNet.Network();
            var inputLayer = new Layers.Layer(Neurons.IdentityNeuron, 2);
            var hiddenLayer = new Layers.Layer(Neurons.RectifiedLinearNeuron, 10, Neurons.BiasNeuron, 1);
            var outputLayer = new Layers.Layer(Neurons.SigmoidNeuron, 1);

            var ihConnection = new Connections.FullConnection(inputLayer, hiddenLayer);
            var hoConnection = new Connections.FullConnection(hiddenLayer, outputLayer);

            ihConnection.parameters = ihConnection.parameters.map(function(el) {
                return Math.random();
            });
            hoConnection.parameters = hoConnection.parameters.map(function(el) {
                return Math.random();
            });

            net.setRootLayer(inputLayer);
            net.setOutputLayer(outputLayer);
            net.addConnection(ihConnection);
            net.addConnection(hoConnection);

            net.resetLayers();

            initialError = 0;
            initialError += net.train([0,0], [1]);
            initialError += net.train([0,1], [0]);
            initialError += net.train([1,0], [0]);
            initialError += net.train([1,1], [1]);
            initialError /= 4;

            finalError = 0;

            for (var i = 0; i < 2000; i += 1) {
                finalError += net.train([0,0], [1]);
                finalError += net.train([0,1], [0]);
                finalError += net.train([1,0], [0]);
                finalError += net.train([1,1], [1]);
            }

            finalError /= (2000 * 4);

            net.resetLayers();
            net.forwardPropogate([1,1]);
            console.log('FINAL: [1,1]=>[1] and got:', net.outputLayer.outputBuffer);
            expect(net.outputLayer.outputBuffer[0]).to.be.above(0.6);

            net.resetLayers();
            net.forwardPropogate([0,1]);
            console.log('FINAL: [0,1]=>[0]', net.outputLayer.outputBuffer);
            expect(net.outputLayer.outputBuffer[0]).to.be.below(0.4);

            net.resetLayers();
            net.forwardPropogate([1,0]);
            console.log('FINAL: [1,0]=>[0]', net.outputLayer.outputBuffer);
            expect(net.outputLayer.outputBuffer[0]).to.be.below(0.4);

            net.resetLayers();
            net.forwardPropogate([0,0]);
            console.log('FINAL: [0,0]=>[1]', net.outputLayer.outputBuffer);
            expect(net.outputLayer.outputBuffer[0]).to.be.above(0.6);

            expect(finalError).to.be.below(initialError);

            done();
        });


    });


});
