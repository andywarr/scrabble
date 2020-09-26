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
      playerTiles: [],
      playerTray: [
        {id: "slot_1", tile_id: null},
        {id: "slot_2", tile_id: null},
        {id: "slot_3", tile_id: null},
        {id: "slot_4", tile_id: null},
        {id: "slot_5", tile_id: null},
        {id: "slot_6", tile_id: null},
        {id: "slot_7", tile_id: null},
      ],
      players: [],
      status: status.READY
    };

    this.done = this.done.bind(this);
    this.setName = this.setName.bind(this);
    this.setStatus = this.setStatus.bind(this);

    this.connect();
  }

  arrangeTiles() {
    this.state.playerTiles.forEach((tile) => {
      if (!this.isTileInTray(tile)) {
        this.addTileToTray(tile);
      }
    });
  }

  addTileToTray(tile) {
    for (let slot of this.state.playerTray) {
      if (slot.tile_id === null) {
        slot.tile_id = tile.id;
        return;
      }
    }
  }

  isTileInTray(tile) {
    let tileInTray = false;

    this.state.playerTray.forEach((slot) => {
      if (slot.tile_id === tile.id) {
        tileInTray = true;
      }
    });

    return tileInTray;
  }

  done() {
    console.log('Player turn complete');
    this.socket.emit('done');
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
    this.socket.emit('status', { status: status });
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

    this.socket.on('tiles', (data) => {
      this.setState({
        playerTiles: data.tiles
      });

      this.arrangeTiles();
    });

    this.socket.on('turn', (data) => {
      this.setState({
        turn: data.turn
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
        <Game done={this.done} playerId={this.state.playerId} playerTray={this.state.playerTray} players={this.state.players} setName={this.setName} setStatus={this.setStatus} status={this.state.status} turn={this.state.turn} />
      </div>
    );
  }
}

export default App;
