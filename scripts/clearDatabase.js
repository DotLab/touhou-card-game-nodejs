(async function() {
  const mongoose = require('mongoose');
  mongoose.connect('mongodb://localhost:27017/tcg', {useNewUrlParser: true});

  const {User} = require('../src/models');

  await User.deleteMany({});

  await mongoose.disconnect();
})();
