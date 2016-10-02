/// <reference path="../../typings/index.d.ts" />
/*global require, describe, expect, assert, it*/
'use strict';

import * as chai from 'chai';
var assert = chai.assert,
    should = chai.should(),
    expect = chai.expect;

import * as utils from '../lib/utils.ts';

describe('Test', function() {
    it('works', function(done) {
        assert.equal(true, true);
        done();
    });
    it('can load modules', function(done) {
        expect(utils).not.to.be.undefined;
        done();
    });
});


describe('Utils Functions', function() {

    it('can dot product', function(done) {
        expect(utils.dotProduct([1, 1, 1], [1, 1, 1])).to.equal(3);

        // Floating point error
        expect(utils.dotProduct([-1, 2.3, 3], [1.1, 0.1, 0])).to.equal(-0.8700000000000001);
        done();
    });

    it('can vector sum', function(done) {
        var test = utils.vectorSum([1,2,3], [4,5,6]);
        expect(test[0]).to.equal(5);
        expect(test[1]).to.equal(7);
        expect(test[2]).to.equal(9);

        test = utils.vectorSum([1,2,3, 4], [4,5,6]);
        expect(test[0]).to.equal(5);
        expect(test[1]).to.equal(7);
        expect(test[2]).to.equal(9);
        expect(test[3]).to.equal(4);

        test = utils.vectorSum([1,2,3], [4,5,6, 6]);
        expect(test[0]).to.equal(5);
        expect(test[1]).to.equal(7);
        expect(test[2]).to.equal(9);
        expect(test[3]).to.equal(6);

        done();
    });

    it('can matrix vec multiply', function(done) {
        var result = utils.matrixVectorMultiplication([0,0,0,0],[0,0]);
        expect(result[0]).to.be.equal(0);
        expect(result[1]).to.be.equal(0);
        expect(result.length).to.be.equal(2);

        result = utils.matrixVectorMultiplication([1,2,3,4,5,6],[5.5, 4.5]);
        expect(result[0]).to.be.equal(1 * 5.5 + 2 * 4.5);
        expect(result[1]).to.be.equal(3 * 5.5 + 4 * 4.5);
        expect(result[2]).to.be.equal(5 * 5.5 + 6 * 4.5);
        expect(result.length).to.be.equal(3);

        result = utils.matrixVectorMultiplication([1,2,3,4,5,6],[5.5, 4.5, 2.1]);
        expect(result[0]).to.be.equal(1 * 5.5 + 2 * 4.5  + 3 * 2.1);
        expect(result[1]).to.be.equal(4 * 5.5 + 5 * 4.5 + 6 * 2.1);
        expect(result.length).to.be.equal(2);

        done();
    });

    it('cannot matrix vec multiply with bad params', function(done) {
        expect(function() {
            return utils.matrixVectorMultiplication([1,2,3],[5.5, 4.5]);
        }).to.throw(Error);

        expect(function() {
            return utils.matrixVectorMultiplication([1,2,3, 4, 5],[5.5, 4.5]);
        }).to.throw(Error);

        done();
    });

    it('can transpose', function(done) {
        var result = utils.transpose([1, 2, 3, 4], 2);
        expect(result[0]).to.be.equal(1);
        expect(result[1]).to.be.equal(3);
        expect(result[2]).to.be.equal(2);
        expect(result[3]).to.be.equal(4);
        expect(result.length).to.be.equal(4);

        result = utils.transpose([1, 2, 3, 4, 5, 6], 2);
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
        var result = utils.matrixVectorMultiplication(mat, [1,1]);
        expect(result[0]).to.be.equal(3);
        expect(result[1]).to.be.equal(7);

        expect(result.length).to.be.equal(2);

        // This time transpose the matrix
        result = utils.matrixVectorMultiplication(utils.transpose(mat, 2), [1,1]);
        expect(result[0]).to.be.equal(4);
        expect(result[1]).to.be.equal(6);

        expect(result.length).to.be.equal(2);


        done();
    });

    it('can zero out vectors', function(done) {
        var vec = [1,2,3,4];
        var result = utils.zero(vec);

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
        var result = utils.outerProduct([1,2,3],[1,2]);

        expect(result.length).to.be.equal(6);
        expect(result[0]).to.be.equal(1);
        expect(result[1]).to.be.equal(2);
        expect(result[2]).to.be.equal(2);
        expect(result[3]).to.be.equal(4);
        expect(result[4]).to.be.equal(3);
        expect(result[5]).to.be.equal(6);

        var result = utils.outerProduct([0, 0], [0, 1]);

        expect(result.length).to.be.equal(4);
        expect(result[0]).to.be.equal(0);
        expect(result[1]).to.be.equal(0);
        expect(result[2]).to.be.equal(0);
        expect(result[3]).to.be.equal(0);

        done();
    });

});
