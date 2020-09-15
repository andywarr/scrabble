import io from 'socket.io-client';
import React, { Component } from "react";

// Import components
import Game from "./Game";
import Share from "./Share";

// Constants
import { status } from '../config.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.socket;

    this.state = {
      gameId: "",
      playerId: "",
      players: [],
      status: status.READY
    };

    this.setName = this.setName.bind(this);
    this.setStatus = this.setStatus.bind(this);

    this.connect();
  }

  getGameId() {
    return window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
  }

  getPlayerId(socket) {
    return socket.id;
  }

  setName(name) {
    console.log(name);
    this.socket.emit('name', { name: name });
  }

  setStatus(status) {
    console.log(status);
    this.socket.emit('status', { name: status });
  }

  connect() {
    this.socket = io();

    this.socket.on('connect', () => {
      var gameId = this.getGameId();
      var playerId = this.getPlayerId(this.socket);

      this.setState({
        gameId: gameId,
        playerId: playerId
      });

      this.socket.emit('game', { gameId: gameId });
    });

    this.socket.on('players', (data) => {
      this.setState({
        players: data.players
      });
    });

    this.socket.on('status', (data) => {
      this.setState({
        status: data.status
      });
    });

    this.socket.on('issue', (data) => {
      console.log(data);
    });
  }

  render() {
    return (
      <div>
        <Share status={this.state.status} />
        <Game playerId={this.state.playerId} players={this.state.players} setName={this.setName} setStatus={this.setStatus} status={this.state.status} />
      </div>
    );
  }
}

export default App;

// import io from 'socket.io-client';
// import React, { useEffect, useState } from "react";
//
// // Import components
// import Game from "./Game";
// import Share from "./Share";
//
// // Constants
// import { status } from '../config.js';
//
// export default function App(props) {
//
//   const [gameId, setGameId] = useState(null);
//   const [playerId, setPlayerId] = useState(null);
//   const [players, setPlayers] = useState([]);
//   const [gameStatus, setGameStatus] = useState(status.READY);
//
//   let socket = null;
//
//   function getGameId() {
//     return window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
//   }
//
//   function getPlayerId(socket) {
//     return socket.id;
//   }
//
//   function emitName(name) {
//     socket.emit('name', { name: name });
//   }
//
//   function emitStatus(status) {
//     socket.emit('status', { name: status });
//   }
//
//   function connect() {
//     //setSocket(io());
//
//     socket = io();
//
//     socket.on('connect', () => {
//       var gameId = getGameId();
//       var playerId = getPlayerId(socket);
//
//       setGameId(gameId);
//       setPlayerId(playerId);
//
//       socket.emit('game', { gameId: gameId });
//     });
//
//     socket.on('players', (data) => {
//       setPlayers(data.players);
//     });
//
//     socket.on('status', (data) => {
//       setGameStatus(data.status);
//     });
//
//     socket.on('issue', (data) => {
//       console.log(data);
//     });
//   }
//
//   useEffect(() => {
//     connect();
//   });
//
//   return (
//     <div>
//       <Share status={status} />
//       <Game playerId={playerId} players={players} setName={emitName} setGameStatus={emitStatus} status={status} />
//     </div>
//   );
// }
