const example = require('../src/example');
const assert = require('assert');

describe('Example', () => {
  describe('#indexOf()', () => {
    it('should return -1 when the value is not present', () => {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
  describe('#example', () => {
    it('should return a + b', () => {
      assert.equal(example(1, 1), 2);
    });
  });
});
