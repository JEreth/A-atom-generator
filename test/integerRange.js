var chai = require('chai');
var assert = chai.assert;
var field = require("../fields/integerRange");


describe('Test field integerRange', function() {
    var f = new field(5,10);
    var v = f.value();
    it('should return an integer', function() {
        assert.isTrue(v === parseInt(v, 10));
    });
    it('should return a value above or equal the minimum', function() {
        assert.isAtLeast(v,5);
    });
    it('should return a value below or equal the maximum', function() {
        assert.isAtMost(v,10);
    });
});
