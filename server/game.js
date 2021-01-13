const board = require('./board.js').board;
const doubleLetters = require('./board.js').doubleLetters;
const doubleWords = require('./board.js').doubleWords;
const tripleLetters = require('./board.js').tripleLetters;
const tripleWords = require('./board.js').tripleWords;
const tiles = require('./tiles.js').tiles;

class Game {
  #board;
  #id;
  #playedTiles;
  #playerTurnIndex;
  #players;
  #status;
  #tiles;

  constructor(id) {
    this.#board = board;
    this.#id = id;
    this.#playedTiles = board;
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

  addTile(tile) {
    this.#tiles.push(tile);
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

      this.#status = 3;
      updateStatus();
    }

    while (numberOfTilesToDraw--) {
      let rand = Math.floor(Math.random() * gameTiles.length);
      selectedTiles.push(...gameTiles.splice(rand, 1));
    }

    this.#tiles = gameTiles;
    player.addTiles(selectedTiles);
    console.log(player.tiles);

    player.updatePlayerTiles();
  }

  get board() {
    return this.#board;
  }

  get id() {
    return this.#id;
  }

  get playedTiles() {
    return this.#playedTiles;
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

  resetPlayedTiles() {
    this.#playedTiles = board;
  }

  score() {
    let score = 0;
    let tileScored = {};
    let wordScore;
    let wordScored;
    let wordLength;
    let wordMultiplier;
    let r;
    let c;

    for (const tile in this.playedTiles) {
      if (this.playedTiles[tile] !== null) {
        // Traverse left
        r = parseInt(tile.split('_')[0]);
        c = parseInt(tile.split('_')[1]);
        wordScore = 0;
        wordScored = true;
        wordLength = 0;
        wordMultiplier = 1;

        while(c > 0 && this.board[`${r}_${c-1}`] !== null) {
          c--;
        }

        while(c <= 14 && this.board[`${r}_${c}`] !== null) {
          wordScored = wordScored && tileScored.hasOwnProperty(`${r}_${c}`);
          tileScored[`${r}_${c}`] = true;
          let tileScore = this.getTile(this.board[`${r}_${c}`]).score;
          if (this.playedTiles[`${r}_${c}`] !== null) {
            if (doubleLetters.has(`${r}_${c}`)) {
              tileScore *= 2;
            } else if (tripleLetters.has(`${r}_${c}`)) {
              tileScore *= 3;
            } else if (doubleWords.has(`${r}_${c}`)) {
              wordMultiplier *= 2;
            } else if (tripleWords.has(`${r}_${c}`)) {
              wordMultiplier *= 3;
            }
          }

          wordScore += tileScore;
          wordLength++;
          c++;
        }

        wordScore *= wordMultiplier;

        if (!wordScored && wordLength > 1) {
          score += wordScore;
        }

        // Traverse up
        r = parseInt(tile.split('_')[0]);
        c = parseInt(tile.split('_')[1]);
        wordScore = 0;
        wordScored = true;
        wordLength = 0;
        wordMultiplier = 1;

        while(r > 0 && this.board[`${r-1}_${c}`] !== null) {
          r--;
        }

        while(r <= 14 && this.board[`${r}_${c}`] !== null) {
          wordScored = wordScored && tileScored.hasOwnProperty(`${r}_${c}`);
          tileScored[`${r}_${c}`] = true;
          let tileScore = this.getTile(this.board[`${r}_${c}`]).score;
          if (this.playedTiles[`${r}_${c}`] !== null) {
            if (doubleLetters.has(`${r}_${c}`)) {
              tileScore *= 2;
            } else if (tripleLetters.has(`${r}_${c}`)) {
              tileScore *= 3;
            } else if (doubleWords.has(`${r}_${c}`)) {
              wordMultiplier *= 2;
            } else if (tripleWords.has(`${r}_${c}`)) {
              wordMultiplier *= 3;
            }
          }

          wordScore += tileScore;
          wordLength++;
          r++;
        }

        wordScore *= wordMultiplier;

        if (!wordScored && wordLength > 1) {
          score += wordScore;
        }
      }
    }

    if (this.players[this.playerTurnIndex].getNumberOfTiles() === 0) {
      score += 50;
    }

    return score;
  }

  set playerTurnIndex(playerTurnIndex) {
    this.#playerTurnIndex = playerTurnIndex;
  }

  set board(board) {
    this.#board = board;
  }

  set playedTiles(tiles) {
    this.#playedTiles = tiles;
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

    let playedTiles = {...this.playedTiles};
    playedTiles[square] = tile;
    this.playedTiles = playedTiles;

    this.players.forEach(player => player.socket.emit('update', { tile, square }));
  }

  updatePlayers() {
    console.log("Updating players");
    this.players.forEach(player => player.socket.emit('players', { players: this.getPlayers() }));
  }

  updateScore(playerId, score) {
    console.log("Updating score", playerId, score);
    this.players.forEach(player => player.socket.emit('score', { playerId, score }));
  }

  updateStatus() {
    console.log("Updating status", this.status);
    this.players.forEach(player => player.socket.emit('status', { status: this.status }));
  }

  isTileConnected() {
    let connected = true;

    for (const tile in this.board) {
      if (this.board[tile] !== null) {
        let r = parseInt(tile.split('_')[0]);
        let c = parseInt(tile.split('_')[1]);
        connected = connected && this.findCenter(r, c, {});
      }
    }

    return connected;
  }

  findCenter(r, c, wasHere) {
    if (r === 7 && c === 7) return true;

    if (this.board[`${r}_${c}`] === null || wasHere.hasOwnProperty(`${r}_${c}`)) return false;

    wasHere[`${r}_${c}`] = true;

    if (c !== 0) { // Checks if not on left edge
      if (this.findCenter(r, c-1, wasHere)) return true;
    }
    if (c !== 14) { // Checks if not on right edge
      if (this.findCenter(r, c+1, wasHere)) return true;
    }
    if (r !== 0) { // Checks if not on top edge
      if (this.findCenter(r-1, c, wasHere)) return true;
    }
    if (r !== 14) { // Checks if not on bottom edge
      if (this.findCenter(r+1, c, wasHere)) return true;
    }

    return false;
  }

  isTileOnCenterSquare() {
    return this.board["7_7"] !== null;
  }
}

module.exports = Game;
