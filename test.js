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
        expect(network.Layers).to.not.be.undefined;
        expect(network.Neurons).to.not.be.undefined;
        done();
    });
});

describe('Layer', function() {
    describe('Arguments', function() {
        it('should accept not accept odd number arguments more than 1', function(done) {
            expect( function() { 
                        return new network.Layer({}, 1, {}) 
                    } ).to.throw(Error);
            expect( function() { 
                        return new network.Layer() 
                    } ).to.throw(Error);
            expect( function() { 
                        return new network.Layer({}, 1, {}, 2, {}) 
                    } ).to.throw(Error);
            done();
        });
    });
});