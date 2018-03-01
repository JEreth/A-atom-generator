var chai = require('chai');
var assert = chai.assert;
var field = require("../fields/currentTimestamp");


describe('Test field currentTimestamp', function() {
    var f = new field(5,10,3);
    var v = f.value();
    it('should return a valid timestamp', function() {
        assert.isTrue((new Date(v)).getTime() > 0);
    });
});
