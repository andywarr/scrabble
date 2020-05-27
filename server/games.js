const Game = require('./game.js');

class Games {
  constructor() {
    this._games = [];
  }

  addGame(game) {
    console.log("Adding game", game.id);
    this._games.push(game);
  }

  createGame(id) {
    console.log("Creating game", id);

    var game = new Game(id);
    this.addGame(game);
    return game;
  }

  getGame(id) {
    console.log("Getting game", id);
    var game = null;

    for (var i = 0, len = this._games.length; i < len; i++) {
      if (this._games[i].id === id) {
        game = this._games[i];
        break;
      }
    }

    return game;
  }

  doesGameExist(id) {
    console.log("Finding game", id);
    var doesPlayerExist = false;

    for (var i = 0, len = this._games.length; i < len; i++) {
      if (this.games[i].id === id) {
        doesPlayerExist =  true;
        break;
      }
    }

    return doesPlayerExist;
  }
}

module.exports = Games;
