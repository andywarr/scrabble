const Game = require('./game.js');

class Games {
  constructor() {
    this._games = [];
  }

  addGame(game) {
    console.log("Adding game", game.id);
    this.games.push(game);
  }

  createGame(id) {
    console.log("Creating game", id);

    var game = new Game(id);
    this.addGame(game);
    return game;
  }

  doesGameExist(id) {
    console.log("Finding game", id);
    return this.games.includes(game => game.id === id);
  }

  get games() {
    return this._games;
  }

  getGame(id) {
    console.log("Getting game", id);
    return this.games.find(game => game.id === id)
  }

  removeGame(id) {
    console.log("Removing game", id);
    this.games = this.games.filter(game => game.id !== id);
  }

  set games(games) {
    this._games = games;
  }
}

module.exports = Games;
