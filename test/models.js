const assert = require('chai').assert;
const mongoose = require('mongoose');
const {User} = require('../src/models');

describe('models', () => {
  before(async () => {
    await mongoose.connect('mongodb://localhost:27017/tcgTest', {useNewUrlParser: true});
  });

  after(async () => {
    await mongoose.disconnect();
  });

  describe('User', () => {
    before(async () => {
      await User.deleteMany({});
    });

    it('create', async () => {
      await User.create({name: 'abc', salt: 'qwe', hash: 'ret', bio: 'ffe'});
      const doc = await User.findOne({name: 'abc'});
      assert.isNotNull(doc);
      assert.strictEqual(doc.name, 'abc');
      assert.strictEqual(doc.salt, 'qwe');
      assert.strictEqual(doc.hash, 'ret');
      assert.strictEqual(doc.bio, 'ffe');
    });
  });
});
