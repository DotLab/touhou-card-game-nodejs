import React from 'react';

import {formatDate, onChange, onSubmit, formatNumber} from './utiles';

import debug from 'debug';
const log = debug('tcg:Lobby');

const Item = ({name, ownerName, members, watchers}) => (<span>
  <strong>{name}</strong> (owned by <em>{ownerName}</em>)&nbsp;
  {!!members.length && <span>
    <strong>{members.length} members:</strong> {members.map(({name}) => (<em key={name}>{name}, </em>))}
  </span>}
  {!!watchers.length && <span>
    <strong>{watchers.length} watchers:</strong> {watchers.map(({name}) => (<em key={name}>{name}, </em>))}
  </span>}
</span>);

export default class Lobby extends React.Component {
  constructor(props) {
    super(props);

    this.app = props.app;

    this.onChange = onChange.bind(this);

    this.onSubmitCreateRoom = onSubmit(this.createRoom.bind(this));
    this.leaveRoom = this.leaveRoom.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.watchRoom = this.watchRoom.bind(this);
    this.onSubmitRoomSendMessage = onSubmit(this.roomSendMessage.bind(this));
    this.roomPropose = this.roomPropose.bind(this);
    this.roomAgree = this.roomAgree.bind(this);
    this.roomRefuse = this.roomRefuse.bind(this);
    this.roomStart = this.roomStart.bind(this);

    this.state = {
      roomNameInput: 'Untitled Room',
      messageInput: '',

      isHosting: null,
      room: null,
      messages: [],
    };
  }

  componentDidMount() {
    const socket = this.app.socket;
    socket.on('sv_update_lobby', (res) => {
      log('sv_update_lobby', res);
      this.setState(res);
    });

    socket.on('sv_room_send_message', (res) => {
      log('sv_room_send_message', res);
      this.setState({
        messages: [
          {
            userName: res.userName,
            date: res.date,
            message: res.message,
          },
          ...this.state.messages,
        ]});
    });

    socket.on('sv_update_room', (room) => {
      log('sv_update_room', room);
      let hasAgreed = false;
      for (let i = 0; i < room.members.length; i += 1) {
        if (this.app.state.user && room.members[i].id === this.app.state.user.id) {
          hasAgreed = room.members[i].hasAgreed;
          break;
        }
      }
      log(this.app.state.user.id, room.ownerId);
      this.setState({
        room: room,
        isHosting: this.app.state.user && this.app.state.user.id === room.ownerId, // ownership may transfer
        hasAgreed, hasAnyAgreed: room.members.filter((x) => x.hasAgreed).length > 0,
      });
    });
  }

  componentWillUnmount() {
    const socket = this.app.socket;
    socket.off('sv_update_lobby');
    socket.off('sv_room_send_message');
    socket.off('sv_update_room');
  }

  async createRoom() {
    const room = await this.app.genericApi1('cl_create_room', {name: this.state.roomNameInput});
    this.setState({room, isHosting: true});
  }

  async leaveRoom() {
    await this.app.genericApi0('cl_leave_room');
    this.setState({room: null, isHosting: null, messages: []});
  }

  async joinRoom(roomId) {
    const room = await this.app.genericApi1('cl_join_room', {roomId});
    this.setState({room, isHosting: false});
  }

  async watchRoom(roomId) {
    const room = await this.app.genericApi1('cl_watch_room', {roomId});
    this.setState({room, isHosting: false});
  }

  async roomSendMessage() {
    if (!this.state.messageInput) return;
    await this.app.genericApi1('cl_room_send_message', {message: this.state.messageInput});
    this.setState({messageInput: ''});
  }

  async roomPropose() {
    await this.app.genericApi0('cl_room_propose');
  }

  async roomAgree() {
    await this.app.genericApi0('cl_room_agree');
  }

  async roomRefuse() {
    await this.app.genericApi0('cl_leave_room');
    this.setState({room: null, isHosting: null});
  }

  async roomStart() {
    await this.app.genericApi0('cl_room_start');
  }

  render() {
    const s = this.state;

    if (!this.app.state.user) {
      return <div></div>;
    }

    return <div id="lobby" className="container mt-2">
      <h2 className="h3">Lobby</h2>
      {!s.room ? <div>
        {s.lobby && <div><strong>{formatNumber(s.lobby.length)} user(s) in lobby:</strong> {s.lobby.map(({name}) => (<em key={name}>{name}, </em>))}</div>}
        <form className="form-inline" onSubmit={this.onSubmitCreateRoom}>
          <input className="form-control mr-2" type="text" defaultValue={s.roomNameInput} name="roomNameInput" onChange={this.onChange}/>
          <button className="btn btn-primary" type="submit">Create Room</button>
        </form>
        {s.rooms && <ul className="mt-2">
          {s.rooms.map((r, i) => (<li key={i}>
            <Item {...r} /> {r.hasStarted ? <button className="btn btn-secondary" onClick={() => this.watchRoom(r.id)}>Watch</button> : <button className="btn btn-warning" onClick={() => this.joinRoom(r.id)}>Join</button>}
          </li>))}
        </ul>}
      </div> : <div>
        <div>Joined room: <Item {...s.room} /> <button className="btn btn-danger" onClick={this.leaveRoom}>Leave Room</button></div>
        {s.room.hasStarted ? <div>
          Enjoy the game!
        </div> : <div>
          {s.room.members.length > 0 ? <div>
            {s.room.hasProposed ? <div>
              <ul>{s.room.members.map(({name, hasAgreed}) => (<li key={name}><strong>{name}</strong> {hasAgreed ? 'Agreed to start' : 'Waiting for agreement'}</li>))}</ul>
              {s.isHosting ? <div>
                {s.hasAnyAgreed ? <button className="btn btn-success" onClick={this.roomStart}>Start the Game</button> : <div>Waiting for members to agree.</div>}
              </div> : <div>
                {!s.hasAgreed ? <div>
                  <button className="btn btn-success" onClick={this.roomAgree}>Agree to Start the Game</button> <button className="btn btn-danger" onClick={this.roomRefuse}>Refuse to Start the Game</button>
                </div> : <div>
                  Waiting for the host to Start the Game
                </div>}
              </div>}
            </div> : <div>
              {s.isHosting ? <div>You are the host! <button className="btn btn-primary" onClick={this.roomPropose}>Propose to Start a Game</button></div> : <div>Waiting for the host to start a game.</div>}
            </div>}
          </div> : <div>
            Not enough members.
          </div>}
        </div>}

        <h3 className="h4 mt-2">Chat</h3>
        <form className="form-inline" onSubmit={this.onSubmitRoomSendMessage}>
          <input className="form-control mr-2" name="messageInput" value={s.messageInput} onChange={this.onChange} />
          <button className="btn btn-outline-secondary" type="submit">Send</button><br/>
        </form>
        {s.messages && !!s.messages.length && <div className="Mah(200px) Ovy(s) mt-2 card px-2">
          {s.messages.map(({userName, date, message}, i) => (<div key={i}><strong>{userName} </strong>({formatDate(date)}): {message}</div>))}
        </div>}
      </div>}
    </div>;
  }
}
