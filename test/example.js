const example = require('../src/example');
const assert = require('assert');

describe('example', () => {
  it('should return a + b', () => {
    assert.equal(example(1, 1), 2);
  });
});
