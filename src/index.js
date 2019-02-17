const debug = require('debug')('tcg');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/tcg', {useNewUrlParser: true});

const {User} = require('./models');

const express = require('express');
const app = express();
const Server = require('http').Server;
const http = new Server(app);

app.use(express.static('public'));

const port = process.env.PORT || 3000;
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
const online = {};

const LOBBY = 'LOBBY';
const SV_UPDATE_LOBBY = 'sv_update_lobby';
const lobby = {};

function joinLobby(userId, userName) {
  lobby[userId] = {id: userId, name: userName};
}

function leaveLobby(userId) {
  delete lobby[userId];
}

const rooms = {};
const SV_UPDATE_ROOM = 'sv_update_room';

function generateId(length = 256) {
  return crypto.randomBytes(length).toString('base64');
}

function createRoom(userId, userName, name) {
  debug('    createRoom', userId, userName, name);
  const id = generateId(32);
  rooms[id] = {id, name, ownerId: userId, ownerName: userName, hasProposed: false, hasStarted: false, members: {}};
  return rooms[id];
}

function joinRoom(roomId, userId, userName) {
  debug('    joinRoom', roomId, userId, userName);
  rooms[roomId].members[userId] = {id: userId, name: userName, hasAgreed: false};
  return rooms[roomId];
}

function leaveRoom(roomId, userId) {
  debug('    leaveRoom', roomId, userId);
  const room = rooms[roomId];

  if (userId == room.ownerId) { // owner leaves
    const memberIds = Object.keys(room.members);
    if (memberIds.length === 0) { // delete when no members
      delete rooms[roomId];
    } else {
      // clear the proposal
      room.hasProposed = false;
      memberIds.forEach((x) => room.members[x].hasAgreed = false);

      // promote first member to be owner
      const newOwner = room.members[memberIds[0]];
      room.ownerId = newOwner.id;
      room.ownerName = newOwner.name;
      delete room.members[memberIds[0]];
    }
  } else { // member leaves
    delete room.members[userId];
  }
}

function serializeRoom(room) {
  return {
    ...room,
    members: Object.keys(room.members).map((userId) => room.members[userId]),
  };
}

function serializeRooms() {
  return Object.keys(rooms).map((roomId) => serializeRoom(rooms[roomId]));
}

function serializeLobby() {
  return {
    lobby: Object.keys(lobby).map((userId) => lobby[userId]),
    rooms: serializeRooms(),
  };
}

const io = require('socket.io')(http);
io.on('connection', function(socket) {
  debug('connection', socket.id);
  let user = null;
  let room = null;

  socket.on('disconnect', async () => {
    debug('disconnect', socket.id);

    if (user) {
      if (room) {
        leaveRoom(room.id, user.id);
        io.to(room.id).emit(SV_UPDATE_ROOM, serializeRoom(room));
      }

      if (lobby[user.id]) {
        leaveLobby(user.id);
      }

      io.to(LOBBY).emit(SV_UPDATE_LOBBY, serializeLobby());

      delete online[user.id];
    }
  });

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
      if (online[doc.id]) {
        return done(error('already logged in'));
      }

      user = doc;
      online[user.id] = true;

      try {
        user.lastDate = Date();
        await User.findByIdAndUpdate(user.id, user);
      } catch (e) {
        done(error('cannot update last seen'));
      }

      debug('last seen', user.lastDate);

      joinLobby(user.id, user.name);
      socket.join(LOBBY);
      io.to(LOBBY).emit(SV_UPDATE_LOBBY, serializeLobby());

      done(success({id: user.id, name: user.name, bio: user.bio}));
    } else {
      done(error('wrong username/password'));
    }
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

  socket.on('cl_statistics', async (done) => {
    debug('cl_statistics');

    if (!user) return done(error('forbidden'));
    done(success({lastDate: user.lastDate}));
  });

  socket.on('cl_create_room', async ({name}, done) => {
    debug('cl_create_room', name);

    if (!user) return done(error('forbidden'));
    if (room) return done(error('already in a room'));

    room = createRoom(user.id, user.name, name);
    socket.join(room.id);

    leaveLobby(user.id);
    socket.leave(LOBBY);
    io.to(LOBBY).emit(SV_UPDATE_LOBBY, serializeLobby());

    done(success(serializeRoom(room)));
  });

  socket.on('cl_join_room', async ({roomId}, done) => {
    debug('cl_join_room', roomId);

    if (!user) return done(error('forbidden'));
    if (room) return done(error('already in a room'));

    room = joinRoom(roomId, user.id, user.name);
    socket.join(room.id);
    io.to(room.id).emit(SV_UPDATE_ROOM, serializeRoom(room));

    leaveLobby(user.id);
    socket.leave(LOBBY);
    io.to(LOBBY).emit(SV_UPDATE_LOBBY, serializeLobby());

    done(success(serializeRoom(room)));
  });

  socket.on('cl_leave_room', async (done) => {
    debug('cl_leave_room');

    if (!user) return done(error('forbidden'));
    if (!room) return done(error('not in any room'));
    if (!room.ownerId === user.id && !room.members[user.id]) return done(error('not a member'));

    leaveRoom(room.id, user.id);
    socket.leave(room.id);
    io.to(room.id).emit(SV_UPDATE_ROOM, serializeRoom(room));

    room = null;

    joinLobby(user.id, user.name);
    socket.join(LOBBY);
    io.to(LOBBY).emit(SV_UPDATE_LOBBY, serializeLobby());

    done(success());
  });

  socket.on('cl_room_propose', async (done) => {
    debug('cl_room_propose');

    if (!user) return done(error('forbidden'));
    if (!room) return done(error('not in any room'));
    if (room.ownerId !== user.id) return done(error('not the host'));

    room.hasProposed = true;
    io.to(room.id).emit(SV_UPDATE_ROOM, serializeRoom(room));

    done(success());
  });

  socket.on('cl_room_agree', async (done) => {
    debug('cl_room_agree');

    if (!user) return done(error('forbidden'));
    if (!room) return done(error('not in any room'));
    if (!room.members[user.id]) return done(error('not a member'));

    room.members[user.id].hasAgreed = true;
    io.to(room.id).emit(SV_UPDATE_ROOM, serializeRoom(room));

    done(success());
  });

  socket.on('cl_room_start', async (done) => {
    debug('cl_room_start');

    if (!user) return done(error('forbidden'));
    if (!room) return done(error('not in any room'));
    if (room.ownerId !== user.id) return done(error('not the host'));

    room.hasStarted = true;
    io.to(room.id).emit(SV_UPDATE_ROOM, serializeRoom(room));

    done(success());
  });

  socket.on('cl_game_action', async (obj, done) => {
    debug('cl_draw_card');
    const res = room.game.act(obj);
    if (res) {
      done(success(room.game.takeSnapshot()));
    } else {
      done(error(res));
    }
  });
});
