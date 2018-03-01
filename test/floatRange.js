var chai = require('chai');
var assert = chai.assert;
var field = require("../fields/floatRange");


describe('Test field floatRange', function() {
    var f = new field(5,10,3);
    var v = f.value();
    it('should return a float with the defined decimals', function() {
        assert.isTrue(Number(v) === v && (v + "").split(".")[1].length==3);
    });
    it('should return a value above or equal the minimum', function() {
        assert.isAtLeast(v,5);
    });
    it('should return a value below or equal the maximum', function() {
        assert.isAtMost(v,10);
    });
});
