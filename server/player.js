class Player {
  #id;
  #name;
  #score;
  #socket;

  constructor(socket) {
    this.#id = socket.id;
    this.#name = "";
    this.#score = 0;
    this.#socket = socket;
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  getPlayer() {
    return {
      id: this.#id,
      name: this.#name,
      score: this.#score
    };
  }

  get score() {
    return this.#score;
  }

  get socket() {
    return this.#socket;
  }

  set id(id) {
    this.#id = id;
  }

  set name(name) {
    this.#name = name;
  }

  set score(score) {
    this.#score = score;
  }

  set socket(socket) {
    this.#socket = socket;
  }
}

module.exports = Player;
