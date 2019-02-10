const debug = require('debug')('tcg');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/tcg', {useNewUrlParser: true});

const {User} = require('./models');

const express = require('express');
const app = express();
const Server = require('http').Server;
const http = new Server(app);

app.use(express.static('public'));

const port = 3000;
http.listen(port, () => debug('listening on port %d', port));

function success(data) {
  return {success: true, data};
}

function error(err) {
  return {error: true, err};
}

const crypto = require('crypto');

/**
 *  Lobby
 */
const rooms = {};

function generateId(length = 256) {
  return crypto.randomBytes(length).toString('base64');
}

function createRoom(userId, userName, name) {
  const id = generateId(64);
  rooms[id] = {ownerId: userId, ownerName: userName, name, members: {}};
  return id;
}

function joinRoom(roomId, userId, userName) {
  rooms[roomId].members[userId] = {memberId: userId, memberName: userName};
  debug('    joinRoom', rooms[roomId].members[userId].memberName);
}

// function leaveRoom(roomId, userId) {
//   if (userId == rooms[roomId].ownerId) { // owner leaves
//     if (rooms[roomId].members.isEmptyObject()) { // delete when no  members
//       delete rooms[roomId];
//     } else { // promote member
//       rooms[roomId].ownerId = Object.keys(rooms[roomId].members)[0];
//     }
//   } else { // member leaves
//     delete rooms[roomId].members[userId];
//   }
// }

function serializeRoomList() {
  return Object.keys(rooms).map((key) => ({
    ...rooms[key],
    id: key,
  }));
}

const io = require('socket.io')(http);
io.on('connection', function(socket) {
  debug('a user connected');
  let user = null;

  socket.on('cl_register', async ({name, password}, done) => {
    debug('cl_register', name, password);

    let doc = await User.findOne({name});
    if (doc) return done(error('existing name'));

    const salt = crypto.randomBytes(256).toString('base64');
    const hasher = crypto.createHash('sha512');
    hasher.update(password);
    hasher.update(salt);
    const hash = hasher.digest('base64');
    const bio = 'CS428 is my favorite class of all time!';

    doc = await User.create({name, salt, hash, bio});

    done(success());
  });

  socket.on('cl_login', async ({name, password}, done) => {
    debug('cl_login', name, password);

    const doc = await User.findOne({name});
    if (!doc) return done(error('wrong username/password'));

    const hasher = crypto.createHash('sha512');
    hasher.update(password);
    hasher.update(doc.salt);
    const hash = hasher.digest('base64');

    if (hash === doc.hash) {
      user = doc;
      return done(success({name: user.name, bio: user.bio}));
    }

    return done(error('wrong username/password'));
  });

  socket.on('cl_update', async ({newName, newBio}, done) => {
    debug('cl_update', newName, newBio);

    if (!user) return done(error('forbidden'));
    user.name = newName ? newName : user.name;
    user.bio = newBio ? newBio : user.bio;
    try {
      await User.findByIdAndUpdate(user.id, user);
      return done(success({name: user.name, bio: user.bio}));
    } catch (e) {
      return done(error('update failed'));
    }
  });

  socket.on('cl_create_room', async ({name}, done) => {
    debug('cl_create_room', name);
    if (!user) return done(error('forbidden'));
    createRoom(user.id, user.name, name);

    socket.broadcast.emit('sv_refresh_rooms', serializeRoomList());

    done(success());
  });

  socket.on('cl_refresh_room', async (done) => {
    debug('cl_refresh_room');

    done(success(serializeRoomList()));
  });

  socket.on('cl_join_room', async ({roomId}, done) => {
    debug('cl_join_room', roomId);
    if (!user) return done(error('forbidden'));
    joinRoom(roomId, user.id, user.name);

    socket.broadcast.emit('sv_refresh_rooms', serializeRoomList());

    done(success());
  });
});
