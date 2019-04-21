const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;

exports.User = mongoose.model('User', {
  name: String,
  salt: String,
  hash: String,
  bio: String,
  joinDate: Date,
  lastDate: Date,
  onlineTime: Number,
  // cached
  gameCount: Number,
  winCount: Number,
  spiritPointsCount: Number,
  magicPointsCount: Number,
  lifeUpgrade: Number,
  following: [String],
  followers: [String],
});

// A User has a record of each game they have played
exports.Record = mongoose.model('Record', {
  userId: ObjectId,
  gameId: String,
  hasWon: Boolean,
});

exports.Flag = mongoose.model('Flag', {
  message: String,
  playerFrom: String,
  playerTo: String,
});
