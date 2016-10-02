/// <reference path="../../typings/index.d.ts" />

/*global require, describe, expect, assert, it*/
'use strict';

import * as chai from 'chai';

import * as neuralNet from '../lib/index';
import * as neurons from '../lib/neurons';
import {Layer} from '../lib/layers';

var assert = chai.assert,
    should = chai.should(),
    expect = chai.expect;

class TestNeuron extends neurons.Neuron {
    forward(a: number) { return 12; }
    backward(b: number) { return 12; }
}


describe('Test', function() {
    it('works', function(done) {
        assert.equal(true, true);
        done();
    });
    it('can load modules', function(done) {
        expect(neurons).to.not.be.undefined;
        done();
    });
});

describe('Layers', function() {
    describe('Arguments', function() {

        it('can init', function(done) {
            let testLayer = new Layer([ {kind: TestNeuron, amount: 3 } ]);
            expect(testLayer.neurons.length).to.equal(3);
            done();
        });
        // it('should accept not accept odd number arguments more than 1', function(done) {
        //     expect( function() {
        //                 return new Layers.Layer({}, 1, {});
        //             } ).to.throw(Error);
        //     expect( function() {
        //                 return new Layers.Layer();
        //             } ).to.throw(Error);
        //     expect( function() {
        //                 return new Layers.Layer({}, 1, {}, 2, {});
        //             } ).to.throw(Error);
        //     done();
        // });

        // it('should accept even arguments at least', function(done) {
        //     expect( function() {
        //                 return new Layers.Layer({}, 1, {}, 2);
        //     } ).to.not.throw(Error);
        //     done();
        // });

        // it('can initialize neuron list with default neurons', function(done) {
        //     var test = new Layers.Layer(Neurons.IdentityNeuron, 10);
        //     expect(test.neurons.length).to.be.equal(10);
        //
        //     test = new Layers.Layer(Neurons.BiasNeuron, 1);
        //     expect(test.neurons.length).to.be.equal(1);
        //
        //     done();
        // });

        // it('can initialize neuron list', function(done) {
        //     var test = new Layers.Layer(Neurons.IdentityNeuron, 10);
        //     expect(test.neurons.length).to.be.equal(10);
        //
        //     test = new Layers.Layer(Neurons.IdentityNeuron, 10, Neurons.BiasNeuron, 1);
        //     expect(test.neurons.length).to.be.equal(11);
        //
        //     done();
        // });

        xit('[deprecated] can initialize neuron list with object interface', function(done) {
            // var test = new Layers.Layer({
            //     forward: function(abc: number) { return 12; },
            //     backward: function(out: number) { return 12; }
            // }, 10);
            //
            // expect(test.neurons.length).to.be.equal(10);
            // expect(test.neurons[0].forward()).to.be.equal(12);
            // expect(test.neurons[0].backward()).to.be.equal(12);
            //
            // var test = new Layer({
            //     forward: function(abc: number) { return 12; },
            //     backward: function(out: number) { return 12; }
            // }, 10, Neurons.BiasNeuron, 22);
            //
            // expect(test.neurons.length).to.be.equal(32);
            // expect(test.neurons[0].forward()).to.be.equal(12);
            //
            // done();
        });

        it('each layer has a different name', function(done) {
            //
            // var lookup = {}, test, i;
            //
            // for (i = 0; i < 3; i++) {
            //     test = new Layer({
            //         forward: function(abc: number) { return 12; },
            //         backward: function(out: number) { return 12; }
            //     }, 5, Neurons.BiasNeuron, 2);
            //
            //
            //     expect(test.name.length).to.be.above(2);
            //     expect(lookup[test.name]).to.be.undefined;
            //     lookup[test.name] = 1;
            // }
            //
            // done();
            expect(false).to.equal(true);
            done();
        });

        it('each neuron has a different name', function(done) {

            var lookup = {};

            var test = new Layer([{
                kind: TestNeuron,
                amount: 5
            },
            {
                kind: neurons.BiasNeuron,
                amount: 2
            }]);

            // Cute uniqueness test! :D
            test.neurons.forEach(function(n) {
                expect(lookup[n.name]).to.be.undefined;
                lookup[n.name] = 1;
            });

            done();
        });

        it('can initialize inputbuffer outputbuffer inputerror outputerror', function(done) {
            var test = new Layer([{kind: neurons.SigmoidNeuron, amount: 10}]);
            expect(test.inputBuffer.length).to.be.equal(test.neurons.length);
            expect(test.outputBuffer.length).to.be.equal(test.neurons.length);
            expect(test.inputError.length).to.be.equal(test.neurons.length);
            expect(test.outputError.length).to.be.equal(test.neurons.length);

            done();
        });
    });

    describe('Helper methods', function() {
        it('can reset buffers', function(done) {
            var test = new Layer([{kind: neurons.IdentityNeuron, amount: 2}]);
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
            var test = new Layer([{kind: neurons.IdentityNeuron, amount: 2}]);
            test.inputBuffer = [1, 1.1];
            test.forward();
            expect(test.outputBuffer[0]).to.be.equal( neurons.IdentityNeuron.prototype.forward(test.inputBuffer[0]) );
            expect(test.outputBuffer[1]).to.be.equal( neurons.IdentityNeuron.prototype.forward(test.inputBuffer[1]) );

            done();
        });

        it('can backward', function(done) {
            var test = new Layer([{kind: neurons.IdentityNeuron, amount: 2}]);
            test.outputError = [1, 1];
            test.backward();
            expect(test.inputError[0]).to.be.equal( neurons.IdentityNeuron.prototype.backward(test.outputError[0]) );
            expect(test.inputError[1]).to.be.equal( neurons.IdentityNeuron.prototype.backward(test.outputError[1]) );

            done();
        });
    });
});
