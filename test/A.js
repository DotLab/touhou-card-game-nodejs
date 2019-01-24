const A = require('../src/A');
const assert = require('assert');

describe('A', () => {
  describe('#add', () => {
    it('return a + b', () => {
      assert.equal(new A().add(1, 1), 2);
    });
  });
  describe('#sub', () => {
    it('return a - b', () => {
      assert.equal(new A().sub(1, 1), 0);
    });
  });
});
