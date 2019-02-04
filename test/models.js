const assert = require('chai').assert;

describe('models', () => {
  const mongoose = require('mongoose');
  mongoose.connect('mongodb://localhost:27017/tcgTest', {useNewUrlParser: true});

  const models = require('../src/models');
  describe('User', () => {
    it('can create', async () => {
      await models.User.create({name: 'abc', salt: 'qwe', hash: 'ret'});
      const doc = await models.User.findOne({name: 'abc'});
      assert.isNotNull(doc);
      assert.strictEqual(doc.name, 'abc');
      assert.strictEqual(doc.salt, 'qwe');
      assert.strictEqual(doc.hash, 'ret');
    });
  });
});
