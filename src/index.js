const debug = require('debug')('tcg');

const express = require('express');
const app = express();
const Server = require('http').Server;
const http = new Server(app);

app.use(express.static('public'));

const port = 3000;
http.listen(port, () => debug('listening on port %d', port));

const io = require('socket.io')(http);
io.on('connection', function(socket) {
  debug('a user connected');
  socket.emit('handshake');
});
