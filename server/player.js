class Player {
  #id;
  #name;
  #score;
  #socket;
  #tiles;

  constructor(socket) {
    this.#id = socket.id;
    this.#name = "";
    this.#score = 0;
    this.#socket = socket;
    this.#tiles = new Set();
  }

  addTile(tile) {
    console.log("Add tile", tile);
    this.#tiles.add(tile)
  }

  removeTile(tile_id) {
    console.log("Remove tile", tile_id);
    this.#tiles.forEach((tile) => {
      if (tile.id === tile_id) {
        this.#tiles.delete(tile);
      }
    });
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  getNumberOfTiles() {
    return this.#tiles.length;
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

  get tiles() {
    return [...this.#tiles];
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

  set tiles(tiles) {
    this.#tiles = new Set(tiles);
  }

  updatePlayerTiles() {
    this.socket.emit('tiles', { tiles: this.tiles });
  }
}

module.exports = Player;
