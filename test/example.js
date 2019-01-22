const example = require('../src/example');
const assert = require('assert');

describe('Example', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
  describe('#example', function() {
    it('should return a + b', function() {
      assert.equal(example(1, 1), 2);
    });
  });
});
