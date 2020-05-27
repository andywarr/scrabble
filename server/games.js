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
    return this._games.find(game => game.id === id)
  }

  doesGameExist(id) {
    console.log("Finding game", id);
    return this._games.includes(game => game.id === id);
  }
}

module.exports = Games;
