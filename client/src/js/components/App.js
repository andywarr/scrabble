import { io } from 'socket.io-client';
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
      board: {
        "0_0": null,
        "0_1": null,
        "0_2": null,
        "0_3": null,
        "0_4": null,
        "0_5": null,
        "0_6": null,
        "0_7": null,
        "0_8": null,
        "0_9": null,
        "0_10": null,
        "0_11": null,
        "0_12": null,
        "0_13": null,
        "0_14": null,
        "1_0": null,
        "1_1": null,
        "1_2": null,
        "1_3": null,
        "1_4": null,
        "1_5": null,
        "1_6": null,
        "1_7": null,
        "1_8": null,
        "1_9": null,
        "1_10": null,
        "1_11": null,
        "1_12": null,
        "1_13": null,
        "1_14": null,
        "2_0": null,
        "2_1": null,
        "2_2": null,
        "2_3": null,
        "2_4": null,
        "2_5": null,
        "2_6": null,
        "2_7": null,
        "2_8": null,
        "2_9": null,
        "2_10": null,
        "2_11": null,
        "2_12": null,
        "2_13": null,
        "2_14": null,
        "3_0": null,
        "3_1": null,
        "3_2": null,
        "3_3": null,
        "3_4": null,
        "3_5": null,
        "3_6": null,
        "3_7": null,
        "3_8": null,
        "3_9": null,
        "3_10": null,
        "3_11": null,
        "3_12": null,
        "3_13": null,
        "3_14": null,
        "4_0": null,
        "4_1": null,
        "4_2": null,
        "4_3": null,
        "4_4": null,
        "4_5": null,
        "4_6": null,
        "4_7": null,
        "4_8": null,
        "4_9": null,
        "4_10": null,
        "4_11": null,
        "4_12": null,
        "4_13": null,
        "4_14": null,
        "5_0": null,
        "5_1": null,
        "5_2": null,
        "5_3": null,
        "5_4": null,
        "5_5": null,
        "5_6": null,
        "5_7": null,
        "5_8": null,
        "5_9": null,
        "5_10": null,
        "5_11": null,
        "5_12": null,
        "5_13": null,
        "5_14": null,
        "6_0": null,
        "6_1": null,
        "6_2": null,
        "6_3": null,
        "6_4": null,
        "6_5": null,
        "6_6": null,
        "6_7": null,
        "6_8": null,
        "6_9": null,
        "6_10": null,
        "6_11": null,
        "6_12": null,
        "6_13": null,
        "6_14": null,
        "7_0": null,
        "7_1": null,
        "7_2": null,
        "7_3": null,
        "7_4": null,
        "7_5": null,
        "7_6": null,
        "7_7": null,
        "7_8": null,
        "7_9": null,
        "7_10": null,
        "7_11": null,
        "7_12": null,
        "7_13": null,
        "7_14": null,
        "8_0": null,
        "8_1": null,
        "8_2": null,
        "8_3": null,
        "8_4": null,
        "8_5": null,
        "8_6": null,
        "8_7": null,
        "8_8": null,
        "8_9": null,
        "8_10": null,
        "8_11": null,
        "8_12": null,
        "8_13": null,
        "8_14": null,
        "9_0": null,
        "9_1": null,
        "9_2": null,
        "9_3": null,
        "9_4": null,
        "9_5": null,
        "9_6": null,
        "9_7": null,
        "9_8": null,
        "9_9": null,
        "9_10": null,
        "9_11": null,
        "9_12": null,
        "9_13": null,
        "9_14": null,
        "10_0": null,
        "10_1": null,
        "10_2": null,
        "10_3": null,
        "10_4": null,
        "10_5": null,
        "10_6": null,
        "10_7": null,
        "10_8": null,
        "10_9": null,
        "10_10": null,
        "10_11": null,
        "10_12": null,
        "10_13": null,
        "10_14": null,
        "11_0": null,
        "11_1": null,
        "11_2": null,
        "11_3": null,
        "11_4": null,
        "11_5": null,
        "11_6": null,
        "11_7": null,
        "11_8": null,
        "11_9": null,
        "11_10": null,
        "11_11": null,
        "11_12": null,
        "11_13": null,
        "11_14": null,
        "12_0": null,
        "12_1": null,
        "12_2": null,
        "12_3": null,
        "12_4": null,
        "12_5": null,
        "12_6": null,
        "12_7": null,
        "12_8": null,
        "12_9": null,
        "12_10": null,
        "12_11": null,
        "12_12": null,
        "12_13": null,
        "12_14": null,
        "13_0": null,
        "13_1": null,
        "13_2": null,
        "13_3": null,
        "13_4": null,
        "13_5": null,
        "13_6": null,
        "13_7": null,
        "13_8": null,
        "13_9": null,
        "13_10": null,
        "13_11": null,
        "13_12": null,
        "13_13": null,
        "13_14": null,
        "14_0": null,
        "14_1": null,
        "14_2": null,
        "14_3": null,
        "14_4": null,
        "14_5": null,
        "14_6": null,
        "14_7": null,
        "14_8": null,
        "14_9": null,
        "14_10": null,
        "14_11": null,
        "14_12": null,
        "14_13": null,
        "14_14": null,
      },
      blankLetters: {},
      errorMsg: "",
      gameId: "",
      joinError: "",
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
      status: status.READY,
      swap: false,
      tilesToSwap: []
    };

    this.cancelSwap = this.cancelSwap.bind(this);
    this.done = this.done.bind(this);
    this.setBlankLetter = this.setBlankLetter.bind(this);
    this.setName = this.setName.bind(this);
    this.removeTileFromTray = this.removeTileFromTray.bind(this);
    this.setStatus = this.setStatus.bind(this);
    this.swapTile = this.swapTile.bind(this);
    this.updateBoard = this.updateBoard.bind(this);
    this.addTileToTray = this.addTileToTray.bind(this);

    this.connect();
  }

  addTileToTray(tile, slot) {
    this.setState((prevState) => {
      const nextTray = prevState.playerTray.map((space) => ({ ...space }));
      for (let space of nextTray) {
        if (slot === null) {
          if (space.tile_id === null) {
            space.tile_id = tile.id;
            break;
          }
        } else if (space.id === slot.id) {
          space.tile_id = tile.id;
          break;
        }
      }
      return { playerTray: nextTray };
    });
    console.log('Add tile to tray', tile);
    this.socket.emit('addTile', { tile_id: tile.id });
  }

  removeTileFromTray(tile) {
    this.setState((prevState) => {
      const nextTray = prevState.playerTray.map((slot) =>
        slot.tile_id === tile.id ? { ...slot, tile_id: null } : { ...slot }
      );
      return { playerTray: nextTray };
    });
    console.log('Remove tile from tray', tile);
    this.socket.emit('removeTile', { tile_id: tile.id });
  }

  isTrayFull() {
    return this.state.playerTray.every((slot) => slot.tile_id !== null);
  }

  cancelSwap() {
    this.setState({
      errorMsg: "",
      swap: false,
      tilesToSwap: []
    });
  }

  done() {
    if (this.isTrayFull() && this.state.swap === false && this.state.status === status.GO) {
      console.log('Player tray is full');
      this.setState({
        errorMsg: "",
        swap: true,
        tilesToSwap: []
      });
    } else {
      if (this.state.swap === true) {
        this.socket.emit('swap', this.state.tilesToSwap);

        this.setState({
          errorMsg: "",
          swap: false,
          tilesToSwap: []
        });
      } else {
        this.socket.emit('done');
      }

      console.log('Player turn complete');
    }
  }

  getGameId() {
    const pathname = window.location.pathname.replace(/\/+$/, '');
    return pathname.substring(pathname.lastIndexOf('/') + 1);
  }

  getPlayerId(socket) {
    return socket.id;
  }

  setBlankLetter(tile, letter) {
    console.log('Set blank letter', tile, letter);
    this.socket.emit('blankLetter', { tile, letter });
  }

  setName(name) {
    console.log('Set name', name);
    this.socket.emit('name', { name });
  }

  swapTile(tile_id) {
    console.log('Swap tile', tile_id);

    this.setState((prevState) => {
      const exists = prevState.tilesToSwap.includes(tile_id);
      const nextTilesToSwap = exists
        ? prevState.tilesToSwap.filter((id) => id !== tile_id)
        : [...prevState.tilesToSwap, tile_id];
      return { tilesToSwap: nextTilesToSwap };
    });
  }

  setStatus(status) {
    console.log('Set status', status);
    this.socket.emit('status', { status });
  }

  updateBoard(tile, square, blankLetter = null) {
    console.log('Update board', tile, square);
    this.socket.emit('update', { tile, square, blankLetter });
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
      console.log('players', data.players);
      this.setState({
        players: data.players
      });
    });

    this.socket.on('score', (data) => {
      console.log('score', data);
    });

    this.socket.on('status', (data) => {
      console.log('status', data.status);
      this.setState({
        status: data.status
      });
    });

    this.socket.on('tiles', (data) => {
      console.log('tiles', data.tiles);
      this.setState((prevState) => {
        const validIds = new Set(data.tiles.map((tile) => tile.id));
        const nextTray = prevState.playerTray.map((slot) => ({
          ...slot,
          tile_id: slot.tile_id && validIds.has(slot.tile_id) ? slot.tile_id : null
        }));

        const placedInTray = new Set(nextTray.map((slot) => slot.tile_id).filter(Boolean));
        data.tiles.forEach((tile) => {
          if (!placedInTray.has(tile.id)) {
            const emptySlot = nextTray.find((slot) => slot.tile_id === null);
            if (emptySlot) {
              emptySlot.tile_id = tile.id;
              placedInTray.add(tile.id);
            }
          }
        });

        return {
          playerTiles: data.tiles,
          playerTray: nextTray
        };
      });
    });

    this.socket.on('turn', (data) => {
      console.log('turn', data.turn);
      this.setState({
        errorMsg: "",
        swap: false,
        tilesToSwap: [],
        turn: data.turn
      });
    });

    this.socket.on('blankLetter', (data) => {
      console.log('blankLetter', data);
      this.setState((prevState) => ({
        blankLetters: {
          ...prevState.blankLetters,
          [data.tile]: data.letter
        }
      }));
    });

    this.socket.on('update', (data) => {
      console.log('update', data);
      this.setState((prevState) => {
        const prevTile = prevState.board[data.square];
        const nextBoard = { ...prevState.board, [data.square]: data.tile };
        const nextBlankLetters = { ...prevState.blankLetters };

        if (data.tile === null && (prevTile === '_1' || prevTile === '_2')) {
          delete nextBlankLetters[prevTile];
        } else if ((data.tile === '_1' || data.tile === '_2') && data.blankLetter) {
          nextBlankLetters[data.tile] = data.blankLetter;
        }

        return {
          board: nextBoard,
          blankLetters: nextBlankLetters
        };
      });
    });

    this.socket.on('issue', (data) => {
      console.log('error', data);
      if (data && data.hasOwnProperty('code')) {
        if (data.code === 1) {
          this.setState({
            errorMsg: data.msg,
          });
        } else if (data.code === 2) {
          this.setState({
            joinError: data.msg,
          });
        }
      }
    });
  }

  render() {
    return (
      <div>
        <Share joinError={this.state.joinError} status={this.state.status} />
        <Game
          addTileToTray={this.addTileToTray}
          blankLetters={this.state.blankLetters}
          board={this.state.board}
          cancelSwap={this.cancelSwap}
          done={this.done}
          errorMsg={this.state.errorMsg}
          playerId={this.state.playerId}
          playerTray={this.state.playerTray}
          players={this.state.players}
          removeTileFromTray={this.removeTileFromTray}
          setBlankLetter={this.setBlankLetter}
          setName={this.setName}
          setStatus={this.setStatus}
          status={this.state.status}
          swap={this.state.swap}
          swapTile={this.swapTile}
          tilesToSwap={this.state.tilesToSwap}
          turn={this.state.turn}
          updateBoard={this.updateBoard}
        />
      </div>
    );
  }
}

export default App;
