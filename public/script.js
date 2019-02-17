/* global $, io */
/* eslint-disable no-console, no-invalid-this */

const accountTmpl = $.templates('#accountTmpl');
const messageTmpl = $.templates('#messageTmpl');
const statisticsTmpl = $.templates('#statisticsTmpl');

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

// source: https://github.com/DotLab/gskse-client-react/blob/master/src/utils.js
function formatDate(date) {
  if (date == null) return null;
  if (typeof date === 'string') {
    date = new Date(date);
  }
  if (new Date().setHours(0, 0, 0, 0) <= date.getTime()) { // date is in today
    return date.toLocaleTimeString();
  }
  return date.toLocaleDateString();
}

function formatTime(time) {
  if (isNaN(time)) {
    return 0;
  } else if (time < 60000) { // less than a minute
    return (time/100).toFixed(2) + ' seconds';
  } else if (time < 3600000) { // less than an hour
    return (time/60000).toFixed(2) + ' minutes';
  } else if (time < 86400000) { // less than a day
    return (time/3600000).toFixed(2) + ' hours';
  } else { // more than a day
    return (time/86400000).toFixed(2) + ' days';
  }
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
      renderStatistics({showStats: false});
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

function renderStatistics(props) {
  console.log('statistics', props);
  $('#statistics').html(statisticsTmpl.render(props));

  $('#statistics-form').on('submit', function(e) {
    e.preventDefault();
    if (props.showStats) {
      renderStatistics({showStats: false});
    } else {
      socket.emit('cl_statistics', function(res) {
        if (res.err) return error(res.err);
        renderStatistics({showStats: true,
          lastDate: formatDate(res.data.lastDate),
          joinDate: formatDate(res.data.joinDate),
          onlineTime: formatTime(res.data.onlineTime)});
      });
    }
  });
}

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
