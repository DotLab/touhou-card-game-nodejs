const mongoose = require('mongoose');

exports.User = mongoose.model('User', {name: String, salt: String, hash: String});
