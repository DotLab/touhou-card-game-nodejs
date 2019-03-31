import React from 'react';
import ReactDOM from 'react-dom';

import './atomic.css';

import App from './App';

import * as serviceWorker from './serviceWorker';

import io from 'socket.io-client';
const socket = io(process.env.NODE_ENV === 'development' ? 'localhost:3000' : undefined);

ReactDOM.render(<App socket={socket}/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
