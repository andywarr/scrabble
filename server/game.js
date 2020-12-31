const board = require('./board.js').board;
const tiles = require('./tiles.js').tiles;

class Game {
  #board;
  #id;
  #playerTurnIndex;
  #players;
  #status;
  #tiles;

  constructor(id) {
    this.#board = board;
    this.#id = id;
    this.#playerTurnIndex;
    this.#players = [];
    this.#status = 0;
    this.#tiles = tiles;
  }

  addPlayer(player) {
    if (!this.doesPlayerExist(player.id)) {
      console.log("Adding player", player.id);
      this.players.push(player);
    }
  }

  doesPlayerExist(id) {
    console.log("Finding player", id);
    return this.players.includes(player => player.id === id);
  }

  drawTiles() {
    this.players.forEach(player => this.getTiles(player));
  }

  getTile(tile_id) {
    let _tile;

    tiles.forEach((tile) => {
      if(tile.id === tile_id) {
        _tile = tile;
      }
    });

    return _tile;
  }

  getTiles(player) {
    const gameTiles = [...this.tiles];
    const playerTiles = [...player.tiles];
    console.log("PLAYER TILES", playerTiles);
    const tilesNeeded = 7 - playerTiles.length;
    let selectedTiles = [];
    let numberOfTilesToDraw = tilesNeeded;

    if (tilesNeeded > gameTiles.length) {
      numberOfTilesToDraw = gameTiles.length;
    }

    while (numberOfTilesToDraw--) {
      let rand = Math.floor(Math.random() * gameTiles.length);
      selectedTiles.push(...gameTiles.splice(rand, 1));
    }

    this.tiles = gameTiles;
    player.tiles = [...playerTiles, ...selectedTiles];

    player.updatePlayerTiles();
  }

  get board() {
    return this.#board;
  }

  get id() {
    return this.#id;
  }

  get playerTurnIndex() {
    return this.#playerTurnIndex;
  }

  get players() {
    return this.#players;
  }

  get status() {
    return this.#status;
  }

  get tiles() {
    return this.#tiles;
  }

  getPlayerTurn() {
    return this.players[this.playerTurnIndex];
  }

  getNumberOfPlayers() {
    return this.players.length;
  }

  getPlayer(id) {
    console.log("Getting player", id);
    return this.players.find(player => player.id === id);
  }

  getPlayers() {
    return this.players.map(player => player.getPlayer())
  }

  removePlayer(id) {
    console.log("Removing player", id);
    this.players = this.players.filter(player => player.id !== id);
  }

  set playerTurnIndex(playerTurnIndex) {
    this.#playerTurnIndex = playerTurnIndex;
  }

  set board(board) {
    this.#board = board;
  }

  set players(players) {
    this.#players = players;
  }

  set status(status) {
    this.#status = status;
  }

  set tiles(tiles) {
    this.#tiles = tiles;
  }

  updatePlayerTurn() {
    if (this.playerTurnIndex  === undefined) {
      this.#playerTurnIndex = 0;
    }
    else if (this.playerTurnIndex + 1 < this.getNumberOfPlayers()) {
      this.#playerTurnIndex = this.playerTurnIndex + 1
    }
    else {
      this.#playerTurnIndex = 0;
    }

    let turn = this.players[this.playerTurnIndex].id;
    console.log("Updating player turn", turn);
    this.players.forEach(player => player.socket.emit('turn', { turn: turn }));
  }

  updateBoard(tile, square) {
    console.log("Updating board", tile, square);
    let board = {...this.board};
    board[square] = tile;
    this.board = board;
    this.players.forEach(player => player.socket.emit('update', { tile, square }));
  }

  updatePlayers() {
    console.log("Updating players");
    this.players.forEach(player => player.socket.emit('players', { players: this.getPlayers() }));
  }

  updateStatus() {
    console.log("Updating status", this.status);
    this.players.forEach(player => player.socket.emit('status', { status: this.status }));
  }
}

module.exports = Game;
