import io from 'socket.io-client';
import React, { Component } from "react";
import ReactDOM from "react-dom";

// Import components
import Share from "./Share";
import Start from "./Start";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {status: "Start"};
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

  shareVisible() {
    console.log("shareVisible", this.state.status);
    if (this.state.status === "Staged") {
      return true;
    } else {
      return false;
    }
  }

  startVisible() {
    console.log("startVisible", this.state.status);
    if (this.state.status === "Start") {
      return true;
    } else {
      return false;
    }
  }

  render() {
    return (
      <div>
        <Start isVisible={this.startVisible()} />
        <Share isVisible={this.shareVisible()} />
      </div>
    );
  }
}

export default App;
