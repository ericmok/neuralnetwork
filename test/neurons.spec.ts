/// <reference path="../typings/index.d.ts" />
/*global require, describe, expect, assert, it*/
'use strict';

import * as chai from 'chai';

var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;

import * as Neurons from '../lib/neurons';

describe('Test', function() {
    it('works', function(done) {
        assert.equal(true, true);
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
            var biasNeuron = new Neurons.BiasNeuron();
            expect(biasNeuron.forward(12)).to.equal(1);
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
