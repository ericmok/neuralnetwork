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
        expect(network.Connections).to.not.be.undefined;
        done();
    });
});

describe('Layers', function() {
    describe('Arguments', function() {
        it('should accept not accept odd number arguments more than 1', function(done) {
            expect( function() { 
                        return new Layers.Layer({}, 1, {});
                    } ).to.throw(Error);
            expect( function() { 
                        return new Layers.Layer();
                    } ).to.throw(Error);
            expect( function() { 
                        return new Layers.Layer({}, 1, {}, 2, {});
                    } ).to.throw(Error);
            done();
        });
        
        it('should accept even arguments at least', function(done) {
            expect( function() { 
                        return new Layers.Layer({}, 1, {}, 2);
            } ).to.not.throw(Error);
            done();
        });
        
        it('can initialize neuron list with default neurons', function(done) {
            var test = new Layers.Layer(Neurons.IdentityNeuron, 10);
            expect(test.neurons.length).to.be.equal(10);
            
            test = new Layers.Layer(Neurons.BiasNeuron, 1);
            expect(test.neurons.length).to.be.equal(1);
            
            done();
        });
        
        it('can initialize neuron list', function(done) {
            var test = new Layers.Layer(Neurons.IdentityNeuron, 10);
            expect(test.neurons.length).to.be.equal(10);   
            
            test = new Layers.Layer(Neurons.IdentityNeuron, 10, Neurons.BiasNeuron, 1);
            expect(test.neurons.length).to.be.equal(11);
            
            done();
        });
        
        it('can initialize neuron list with object interface', function(done) {
            var test = new Layers.Layer({
                forward: function(abc) { return 12; },
                backward: function(out) { return 12; }
            }, 10);
            
            expect(test.neurons.length).to.be.equal(10);
            expect(test.neurons[0].forward()).to.be.equal(12);
            expect(test.neurons[0].backward()).to.be.equal(12);
            
            var test = new Layers.Layer({
                forward: function(abc) { return 12; },
                backward: function(out) { return 12; }
            }, 10, Neurons.BiasNeuron, 22);
            
            expect(test.neurons.length).to.be.equal(32);
            expect(test.neurons[0].forward()).to.be.equal(12);
            
            done();
        });
        
        it('each layer has a different name', function(done) {
            
            var lookup = {}, test, i;
            
            for (i = 0; i < 3; i++) {
                test = new Layers.Layer({
                    forward: function(abc) { return 12; },
                    backward: function(out) { return 12; }
                }, 5, Neurons.BiasNeuron, 2);
                
                
                expect(test.name.length).to.be.above(2);
                expect(lookup[test.name]).to.be.undefined;
                lookup[test.name] = 1;
            }
            
            done();
        });
        
        it('each neuron has a different name', function(done) {
            
            var lookup = {};
            
            var test = new Layers.Layer({
                forward: function(abc) { return 12; },
                backward: function(out) { return 12; }
            }, 5, Neurons.BiasNeuron, 2);
            
            // Cute uniqueness test! :D
            test.neurons.forEach(function(n) {
                expect(lookup[n.name]).to.be.undefined;
                lookup[n.name] = 1;
            });
            
            done();
        });
        
        it('can initialize inputbuffer outputbuffer inputerror outputerror', function(done) {
            var test = new Layers.Layer(Neurons.SigmoidNeuron, 10);
            expect(test.inputBuffer.length).to.be.equal(test.neurons.length);
            expect(test.outputBuffer.length).to.be.equal(test.neurons.length);
            expect(test.inputError.length).to.be.equal(test.neurons.length);
            expect(test.outputError.length).to.be.equal(test.neurons.length);
            
            done();
        });
    });
    
    describe('Helper methods', function() {
        it('can reset buffers', function(done) {
            var test = new Layers.Layer(Neurons.IdentityNeuron, 2);
            test.inputBuffer = [1, 1.1];
            test.forward();
            
            test.resetBuffers();
            
            expect(test.inputBuffer.length).to.be.equal(2);
            expect(test.inputBuffer[0]).to.be.equal(0);
            expect(test.inputBuffer[1]).to.be.equal(0);
            
            expect(test.outputBuffer[0]).to.be.equal(0);
            expect(test.outputBuffer[1]).to.be.equal(0);
            
            expect(test.inputError[0]).to.be.equal(0);
            expect(test.inputError[1]).to.be.equal(0);
            
            expect(test.outputError[0]).to.be.equal(0);
            expect(test.outputError[1]).to.be.equal(0);
            
            done();
        });
    });
    
    describe('Propogation', function() {
        
        it('can forward', function(done) {
            var test = new Layers.Layer(Neurons.IdentityNeuron, 2);
            test.inputBuffer = [1, 1.1];
            test.forward();
            expect(test.outputBuffer[0]).to.be.equal( Neurons.IdentityNeuron.prototype.forward(test.inputBuffer[0]) );
            expect(test.outputBuffer[1]).to.be.equal( Neurons.IdentityNeuron.prototype.forward(test.inputBuffer[1]) );
            
            done();
        });
        
        it('can backward', function(done) {
            var test = new Layers.Layer(Neurons.IdentityNeuron, 2);
            test.outputError = [1, 1];
            test.backward();
            expect(test.inputError[0]).to.be.equal( Neurons.IdentityNeuron.prototype.backward(test.outputError[0]) );
            expect(test.inputError[1]).to.be.equal( Neurons.IdentityNeuron.prototype.backward(test.outputError[1]) );
            
            done();
        });
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
    });
    
    describe('Constructor', function() {
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
            con.zeroParameters();

            expect(con.parameters[0]).to.be.equal(0);
            expect(con.parameters[1]).to.be.equal(0);
            
            done();
        });
        
        it('can set params to 1 using zeroParameters()', function(done) {
            var con = new Connections.FullConnection(inputLayer, outputLayer);
            
            con.zeroParameters(1);
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
             
            done();
        });
    });
});

describe('Network', function() {

    
    describe('Structure', function() {


        describe('can set root layer and output layer', function() {        
            var net = new network.Network();
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
            var net = new network.Network();
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
                var net = new network.Network();
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
            var net = new network.Network();
            var inputLayer = new Layers.Layer(Neurons.IdentityNeuron, 2);
            var hiddenLayer = new Layers.Layer(Neurons.IdentityNeuron, 2);
            var outputLayer = new Layers.Layer(Neurons.IdentityNeuron, 2);

            var ihConnection = new Connections.FullConnection(inputLayer, hiddenLayer);
            var hoConnection = new Connections.FullConnection(hiddenLayer, outputLayer);

            ihConnection.zeroParameters(1);
            hoConnection.zeroParameters(1);
            
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

    describe('Propogation', function() {
        var net = new network.Network();
        var inputLayer = new Layers.Layer(Neurons.IdentityNeuron, 2);
        var hiddenLayer = new Layers.Layer(Neurons.IdentityNeuron, 2);
        var outputLayer = new Layers.Layer(Neurons.IdentityNeuron, 2);

        var ihConnection = new Connections.FullConnection(inputLayer, hiddenLayer);
        var hoConnection = new Connections.FullConnection(hiddenLayer, outputLayer);

        ihConnection.zeroParameters(1);
        hoConnection.zeroParameters(1);

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
        
        xit('can backward propogate', function(done) {
            
            done();
        });
        
        xit('can train', function(done) {
            done();
        });
    });
    

});
