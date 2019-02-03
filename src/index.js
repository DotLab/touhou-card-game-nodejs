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

    doc = await User.create({name, salt, hash});

    done(success());
  });

  socket.on('cl_login', async ({name, password}, done) => {
    debug('cl_login', name, password);

    const doc = await User.findOne({name});
    if (!doc) return done(error('Wrong username/password'));

    const hasher = crypto.createHash('sha512');
    hasher.update(password);
    hasher.update(doc.salt);
    const hash = hasher.digest('base64');

    if (hash === doc.hash) {
      user = doc;
      return done(success({name: user.name}));
    }
    return done(error('Wrong username/password'));
  });
});
