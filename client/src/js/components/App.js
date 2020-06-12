import io from 'socket.io-client';
import React, { Component } from "react";
import ReactDOM from "react-dom";
import Share from "./Share";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {status: "Staged"};

    this.setUp();
  }

  getGameId() {
    return window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
  }

  getPlayerId(socket) {
    return socket.id;
  }

  setUp() {
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

  shareModalVisible() {
    console.log("shareModalVisible", this.state.status);
    if (this.state.status === "Staged") {
      return true;
    } else {
      return false;
    }
  }

  render() {
    return (
        <Share isVisible={this.shareModalVisible()} />
    );
  }
}

export default App;
