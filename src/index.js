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
// const rooms = {};

// function generateId(length =256) {
//   return crypto.randomBytes(length).toString('base64');
// }

// function createRoom(userId, name) {
//   const id = generateId();
//   rooms[id] = {ownerId: userId, name, members: {}};
//   return id;
// }

// function joinRoom(roomId, userId) {
//   rooms[roomId].members[userId] = true;
// }

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

const io = require('socket.io')(http);
io.on('connection', function(socket) {
  debug('a user connected');

  socket.on('cl_register', async ({name, password}, done) => {
    debug('cl_register', name, password);

    let doc = await User.findOne({name});
    if (doc) return done(error('existing name'));

    const salt = crypto.randomBytes(256).toString('base64');
    const hasher = crypto.createHash('sha512');
    hasher.update(password);
    hasher.update(salt);
    const hash = hasher.digest('base64');

    doc = await User.create({name, salt, hash});

    done(success());
  });

  socket.on('cl_create_room', async ({name}, done) => {
    debug('cl_create_room', name);

    // createRoom(userId, name);

    done(success());
  });
});
