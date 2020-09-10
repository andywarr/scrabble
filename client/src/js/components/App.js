import io from 'socket.io-client';
import React, { Component } from "react";
import ReactDOM from "react-dom";

// Import components
import Game from "./Game";
import Share from "./Share";

// Constants
import { status } from '../config.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: status.READY
    };

    this.connect();
  }

  getGameId() {
    return window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
  }

  getPlayerId(socket) {
    return socket.id;
  }

  connect() {
    const socket = io();

    socket.on('connect', () => {
      var gameId = this.getGameId();
      var playerId = this.getPlayerId(socket);

      socket.emit('game', { gameId: gameId });
    });

    socket.on('status', (data) => {
      console.log(data);

      this.setState({
        status: data.status
      });
    });

    socket.on('issue', (data) => {
      console.log(data);
    });
  }

  render() {
    return (
      <div>
        <Share status={this.state.status} />
        <Game />
      </div>
    );
  }
}

export default App;
