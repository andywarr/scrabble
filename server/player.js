class Player {
  #id;
  #socket;

  constructor(socket) {
    this.#id = socket.id;
    this.#socket = socket;
  }

  get id() {
    return this.#id;
  }

  get socket() {
    return this.#socket;
  }

  set id(id) {
    this.#id = id;
  }

  set socket(socket) {
    this.#socket = socket;
  }
}

module.exports = Player;
