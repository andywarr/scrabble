class Player {
  constructor(socket) {
    this._id = socket.id;
    this._socket = socket;
  }

  get id() {
    return this._id;
  }

  get socket() {
    return this._socket;
  }

  set id(id) {
    this._id = id;
  }

  set socket(socket) {
    this._socket = socket;
  }
}

module.exports = Player;
