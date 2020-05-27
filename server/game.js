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
    var doesPlayerExist = false;

    for (var i = 0, len = this._players.length; i < len; i++) {
      if (this._players[i].id === id) {
        doesPlayerExist =  true;
        break;
      }
    }

    return doesPlayerExist;
  }

  get id() {
    return this._id;
  }

  getNumberOfPlayers() {
    return this._players.length;
  }

  getPlayer(id) {
    console.log("Getting player", id);
    var player = null;

    for (var i = 0, len = this._players.length; i < len; i++) {
      if (this._players[i].id === id) {
        player = this._players[i];
        break;
      }
    }

    return player;
  }

  sendAllPlayersMessage(name, data) {
    console.log("Send all players a message", name, data);

    for (var i = 0, len = this._players.length; i < len; i++) {
      this._players[i].socket.emit(name, data);
    }

  }

  updateStatus(status) {
    console.log("Update status", status);
    this._status = status;

    this.sendAllPlayersMessage('status', { status: status });
  }
}

module.exports = Game;
