class Game {
  constructor(id) {
    this._id = id;
    this._players = [];
    this._status = 'Staged'
  }

  addPlayer(player) {
    if (!this.doesPlayerExist(player.id)) {
      this._players.push(player);
    }
  }

  doesPlayerExist(id) {
    console.log("Finding player", id);
    return this._players.includes(player => player.id === id);
  }

  get id() {
    return this._id;
  }

  getNumberOfPlayers() {
    return this._players.length;
  }

  getPlayer(id) {
    console.log("Getting player", id);
    return this._players.find(player => player.id === id);
  }

  sendAllPlayersMessage(name, data) {
    console.log("Send all players a message", name, data);
    this._players.forEach(player => player.socket.emit(name, data));
  }

  updateStatus(status) {
    console.log("Update status", status);
    this._status = status;

    this.sendAllPlayersMessage('status', { status: status });
  }
}

module.exports = Game;
