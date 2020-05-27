class Game {
  constructor(id) {
    this._id = id;
    this._players = [];
    this._status = 'Staged'
  }

  addPlayer(player) {
    if (!this.doesPlayerExist(player.id)) {
      this.players.push(player);
    }
  }

  doesPlayerExist(id) {
    console.log("Finding player", id);
    return this.players.includes(player => player.id === id);
  }

  get id() {
    return this._id;
  }

  get players() {
    return this._players;
  }

  get status() {
    return this._status;
  }

  getNumberOfPlayers() {
    return this.players.length;
  }

  getPlayer(id) {
    console.log("Getting player", id);
    return this.players.find(player => player.id === id);
  }

  removePlayer(id) {
    console.log("Removing player", id);
    this.players = this.players.filter(player => player.id !== id);
  }

  set players(players) {
    this._players = players;
  }

  set status(status) {
    this._status = status;
  }

  updateStatus() {
    console.log("Updating status", this.status);
    this.players.forEach(player => player.socket.emit('status', { status: this.status }));
  }
}

module.exports = Game;
