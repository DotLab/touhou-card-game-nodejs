/* global $, io, formatDate, formatTime */
/* eslint-disable no-console, no-invalid-this */

const accountTmpl = $.templates('#accountTmpl');
const messageTmpl = $.templates('#messageTmpl');

const error = function(err) {
  alert(JSON.stringify(err));
};

function createHandler(resolve, reject) {
  return function(res) {
    if (res.err) {
      if (reject) reject(res.err);
    } else {
      if (resolve) resolve(res.data);
    }
  };
}

const socket = io();
let user = null;

socket.on('handshake', function() {
  console.log('handshake');
});

renderAccount({isLoggedIn: false});

function renderMessage(props) {
  $('#message').html(messageTmpl.render(props));
}

function renderAccount(props) {
  console.log('renderAccount', props);
  $('#account').html(accountTmpl.render(props));

  $('#register-form').on('submit', function(e) {
    e.preventDefault();
    socket.emit('cl_register', {
      name: $('#register-form-name').val(),
      password: $('#register-form-password').val(),
    }, function(res) {
      if (res.err) return error(res.err);
      renderMessage({message: 'Registered!'});
    });
  });

  $('#login-form').on('submit', function(e) {
    e.preventDefault();
    socket.emit('cl_login', {
      name: $('#login-form-name').val(),
      password: $('#login-form-password').val(),
    }, function(res) {
      if (res.err) return error(res.err);
      user = res.data;
      renderAccount({
        name: res.data.name,
        bio: res.data.bio,
        isLoggedIn: true,
      });
      renderMessage({message: `Welcome ${res.data.name}!`});
      statistics.setState({
        showStats: false,
        lastDate: formatDate(res.data.lastDate),
        joinDate: formatDate(res.data.joinDate),
        onlineTime: formatTime(res.data.onlineTime),
        gameCount: res.data.gameCount,
        winCount: res.data.winCount,
      });
    });
  });

  $('#update-form').on('submit', function(e) {
    e.preventDefault();
    socket.emit('cl_update', {
      newName: $('#update-form-name').val(),
      newBio: $('#update-form-bio').val(),
    }, function(res) {
      if (res.err) return error(res.err);
      renderAccount({
        name: res.data.name,
        bio: res.data.bio,
        isLoggedIn: true,
      });
      renderMessage({message: 'Account updated successfully!'});
    });
  });
}

const statistics = new (function Statistics(selector, tmpl, props) {
  this.state = props;
  const self = this;

  self.setState = function(state) {
    Object.assign(self.state, state);
    console.log('statistics#render', self.state);
    $(selector).html(tmpl.render(self.state));

    $(selector + ' form').on('submit', function(e) {
      e.preventDefault();
      self.setState({showStats: !self.state.showStats});
    });
  };
})('#statistics', $.templates('#statisticsTmpl'), {});

const lobby = new (function Lobby(selector, tmpl, props) {
  this.state = props;

  const self = this;

  self.setState = function(state) {
    Object.assign(self.state, state);
    console.log('lobby.render', self.state);
    $(selector).html(tmpl.render(self.state));

    $(selector + ' .createRoom').on('submit', function(e) {
      e.preventDefault();
      socket.emit('cl_create_room', {
        name: $(selector + ' .roomName').val(),
      }, createHandler(function(room) {
        self.setState({room: room, isHosting: true});
      }, error));
    });

    $(selector + ' .leaveRoom').on('click', function() {
      socket.emit('cl_leave_room', createHandler(function() {
        self.setState({room: null, isHosting: null});
      }, error));
    });

    $(selector + ' .joinRoom').on('click', function() {
      socket.emit('cl_join_room', {
        roomId: $(this).attr('value'),
      }, createHandler(function(room) {
        self.setState({room: room, isHosting: false});
      }, error));
    });

    $(selector + ' .propose').on('click', function() {
      socket.emit('cl_room_propose', createHandler(null, error));
    });

    $(selector + ' .agree').on('click', function() {
      socket.emit('cl_room_agree', createHandler(null, error));
    });

    $(selector + ' .refuse').on('click', function() {
      socket.emit('cl_leave_room', createHandler(function() {
        self.setState({room: null, isHosting: null});
      }, error));
    });

    $(selector + ' .start').on('click', function() {
      socket.emit('cl_room_start', createHandler(null, error));
    });
  };
})('#lobby', $.templates('#lobbyTmpl'), {});

socket.on('sv_update_lobby', function(res) {
  lobby.setState(res);
});

socket.on('sv_update_room', function(room) {
  console.log('sv_update_room', room);
  let hasAgreed = false;
  for (let i = 0; i < room.members.length; i += 1) {
    if (room.members[i].id === user.id) {
      hasAgreed = room.members[i].hasAgreed;
      break;
    }
  }
  lobby.setState({
    room: room,
    isHosting: user.id === room.ownerId, // ownership may transfer
    hasAgreed: hasAgreed,
    hasAnyAgreed: room.members.filter((x) => x.hasAgreed).length > 0,
  });
});

const game = new (function Game(selector, tmpl, props) {
  this.state = props;
  const self = this;

  self.setState = function(state) {
    Object.assign(self.state, state);
    console.log('Game#render', self.state);
    $(selector).html(tmpl.render(self.state));

    $(selector + ' .card').on('click', function() {
      console.log('cardId:', $(this).attr('id'), ', playerId:', $(this).attr('player-id'));
    });
  };
})('#game', $.templates('#gameTmpl'), {opponents: []});

const gamePlayerListItemConfig = {
  id: 'abc',
  name: 'Kai',
  life: 4000,
  hand: [
    {id: 'a', imgUrl: '/imgs/card-back.png'},
    {id: 'b', imgUrl: '/imgs/card-back.png'},
    {id: 'c', imgUrl: '/imgs/card-back.png'},
    {id: 'd', imgUrl: '/imgs/card-back.png'},
    {id: 'e', imgUrl: '/imgs/card-back.png'},
  ],
  field: {
    environment: {id: 'f', imgUrl: '/imgs/card-placeholder.png'},
    graveyard: {id: 'g', imgUrl: '/imgs/card-back.png'},
    monster: [
      {id: 'h', imgUrl: '/imgs/card-blue-eyes-white-dragon.png', name: 'Blue-Eyes White Dragon', desc: ''},
      {id: 'm', imgUrl: '/imgs/card-placeholder.png'},
      {id: 'k', imgUrl: '/imgs/card-placeholder.png'},
      {id: 'j', imgUrl: '/imgs/card-placeholder.png'},
    ],
    spell: [
      {id: 'l', imgUrl: '/imgs/card-placeholder.png'},
      {id: 'i', imgUrl: '/imgs/card-floodgate-trap-hole.png', name: 'Floodgate Trap Hole', desc: ''},
      {id: 'n', imgUrl: '/imgs/card-placeholder.png'},
      {id: 'o', imgUrl: '/imgs/card-placeholder.png'},
    ],
  },
};
const gameConfig = {
  ...gamePlayerListItemConfig,
  opponents: [gamePlayerListItemConfig, gamePlayerListItemConfig, gamePlayerListItemConfig],
};

game.setState(gameConfig);
