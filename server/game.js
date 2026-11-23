const board = require('./board.js').board;
const doubleLetters = require('./board.js').doubleLetters;
const doubleWords = require('./board.js').doubleWords;
const tripleLetters = require('./board.js').tripleLetters;
const tripleWords = require('./board.js').tripleWords;
const tiles = require('./tiles.js').tiles;

const READY = 0;
const SET = 1;
const GO = 2;
const FINAL = 3;
const END = 4;

class Game {
  #blankLetters;
  #board;
  #consecutivePasses;
  #id;
  #playedTiles;
  #playerTurnIndex;
  #players;
  #status;
  #tileById;
  #tiles;

  constructor(id) {
    this.#blankLetters = {};
    this.#board = { ...board };
    this.#consecutivePasses = 0;
    this.#id = id;
    this.#playedTiles = { ...board };
    this.#playerTurnIndex = undefined;
    this.#players = [];
    this.#status = READY;
    this.#tiles = tiles.map(tile => ({ ...tile }));
    this.#tileById = new Map(this.#tiles.map(tile => [tile.id, tile]));
  }

  addPlayer(player) {
    if (!this.doesPlayerExist(player.id)) {
      console.log("Adding player", player.id);
      this.players.push(player);
    }
  }

  addTile(tile) {
    if (!tile) {
      return;
    }
    if (!this.#tiles.some(existing => existing.id === tile.id)) {
      this.#tiles.push(tile);
    }
  }

  canSwap() {
    return this.#status === GO && this.#tiles.length >= 7;
  }

  doesPlayerExist(id) {
    console.log("Finding player", id);
    return this.players.some(player => player.id === id);
  }

  drawTiles() {
    this.players.forEach(player => this.getTiles(player));
  }

  endGame(wentOut = true) {
    let total_score = 0;

    this.players.forEach(player => {
      let remainingScore = 0;

      player.tiles.forEach((tile) => {
        remainingScore += tile.score;
      });

      player.reducePlayerScore(remainingScore);
      total_score += remainingScore;
    });

    if (wentOut && this.players[this.playerTurnIndex]) {
      let player = this.players[this.playerTurnIndex];
      player.updatePlayerScore(total_score);
    }

    this.updatePlayers();

    this.status = END;
    this.updateStatus();
  }

  getBlankLetter(tile_id) {
    return this.#blankLetters[tile_id] || null;
  }

  getTile(tile_id) {
    return this.#tileById.get(tile_id);
  }

  getTileLetter(tile_id) {
    if (this.isBlankTile(tile_id)) {
      return this.#blankLetters[tile_id] || '';
    }
    const tile = this.getTile(tile_id);
    return tile ? tile.letter : '';
  }

  getTiles(player) {
    const gameTiles = [...this.tiles];
    const playerTiles = [...player.tiles];
    console.log("PLAYER TILES", playerTiles);
    const tilesNeeded = Math.max(0, 7 - playerTiles.length);
    let selectedTiles = [];
    let numberOfTilesToDraw = Math.min(tilesNeeded, gameTiles.length);

    while (numberOfTilesToDraw > 0) {
      numberOfTilesToDraw--;
      let rand = Math.floor(Math.random() * gameTiles.length);
      selectedTiles.push(...gameTiles.splice(rand, 1));
    }

    this.#tiles = gameTiles;
    player.addTiles(selectedTiles);
    console.log(player.tiles);

    player.updatePlayerTiles();
    this.syncBagStatus();
  }

  syncBagStatus() {
    if (this.#status === GO && this.#tiles.length < 7) {
      this.#status = FINAL;
      this.updateStatus();
    } else if (this.#status === FINAL && this.#tiles.length >= 7) {
      this.#status = GO;
      this.updateStatus();
    }
  }

  get blankLetters() {
    return { ...this.#blankLetters };
  }

  get board() {
    return this.#board;
  }

  get consecutivePasses() {
    return this.#consecutivePasses;
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
    return this.players.map(player => player.getPlayer());
  }

  getPlayedPositions() {
    const positions = [];
    for (const key in this.#playedTiles) {
      if (this.#playedTiles[key] !== null) {
        const [r, c] = key.split('_').map(Number);
        positions.push({ r, c, key, tileId: this.#playedTiles[key] });
      }
    }
    return positions;
  }

  isBlankTile(tile_id) {
    return tile_id === '_1' || tile_id === '_2';
  }

  isFirstMove() {
    for (const key in this.#board) {
      if (this.#board[key] !== null && this.#playedTiles[key] === null) {
        return false;
      }
    }
    return true;
  }

  isOutOfTiles() {
    const currentPlayer = this.players[this.playerTurnIndex];
    if (!currentPlayer) {
      return false;
    }
    return this.#tiles.length === 0 && currentPlayer.getNumberOfTiles() === 0;
  }

  isStalemate() {
    return this.#players.length > 0 && this.#consecutivePasses >= this.#players.length * 2;
  }

  isGameOver() {
    return this.isOutOfTiles() || this.isStalemate();
  }

  recordPass() {
    this.#consecutivePasses += 1;
  }

  resetConsecutivePasses() {
    this.#consecutivePasses = 0;
  }

  removePlayer(id) {
    console.log("Removing player", id);
    this.players = this.players.filter(player => player.id !== id);
  }

  revertPlayedTiles() {
    const played = this.getPlayedPositions();
    if (played.length === 0) {
      return [];
    }

    const updatedBoard = { ...this.#board };
    played.forEach(({ key, tileId }) => {
      updatedBoard[key] = null;
      if (this.isBlankTile(tileId)) {
        delete this.#blankLetters[tileId];
      }
    });

    this.#board = updatedBoard;
    this.resetPlayedTiles();

    played.forEach(({ key }) => {
      this.players.forEach(player => player.socket.emit('update', { tile: null, square: key, blankLetter: null }));
    });

    return played.map(({ tileId }) => this.getTile(tileId)).filter(Boolean);
  }

  handleDisconnect(playerId) {
    const removedIndex = this.#players.findIndex(player => player.id === playerId);
    if (removedIndex === -1) {
      return { shouldRemoveGame: false };
    }

    const removedPlayer = this.#players[removedIndex];
    const wasCurrentTurn = this.#playerTurnIndex === removedIndex;
    let revertedTiles = [];

    if ((this.#status === GO || this.#status === FINAL) && wasCurrentTurn) {
      revertedTiles = this.revertPlayedTiles();
    }

    this.#players.splice(removedIndex, 1);

    if (this.#players.length === 0) {
      return { shouldRemoveGame: true };
    }

    if (this.#status === GO || this.#status === FINAL) {
      revertedTiles.forEach(tile => this.addTile(tile));
      removedPlayer.tiles.forEach(tile => this.addTile(tile));
      this.syncBagStatus();
    }

    this.updatePlayers();

    if (this.#status === SET && this.#players.length === 1) {
      this.#status = READY;
      this.updateStatus();
    } else if (this.#status === GO || this.#status === FINAL) {
      if (this.#players.length === 1) {
        this.#status = END;
        this.updateStatus();
      } else {
        if (removedIndex < this.#playerTurnIndex) {
          this.#playerTurnIndex -= 1;
        } else if (wasCurrentTurn) {
          this.#playerTurnIndex = this.#playerTurnIndex % this.#players.length;
          const turn = this.#players[this.#playerTurnIndex].id;
          this.#players.forEach(player => player.socket.emit('turn', { turn }));
        }
      }
    }

    return { shouldRemoveGame: false };
  }

  resetPlayedTiles() {
    this.#playedTiles = { ...board };
  }

  getFormedWords() {
    const words = [];
    const seen = new Set();
    const played = this.getPlayedPositions();

    for (const { r, c } of played) {
      // Horizontal word
      let startC = c;
      while (startC > 0 && this.#board[`${r}_${startC - 1}`] !== null) {
        startC--;
      }
      const hKey = `H_${r}_${startC}`;
      if (!seen.has(hKey)) {
        const squares = [];
        let cc = startC;
        while (cc <= 14 && this.#board[`${r}_${cc}`] !== null) {
          squares.push(`${r}_${cc}`);
          cc++;
        }
        if (squares.length > 1) {
          seen.add(hKey);
          const word = squares.map(sq => this.getTileLetter(this.#board[sq])).join('');
          words.push({ word, direction: 'H', startRow: r, startCol: startC, squares });
        }
      }

      // Vertical word
      let startR = r;
      while (startR > 0 && this.#board[`${startR - 1}_${c}`] !== null) {
        startR--;
      }
      const vKey = `V_${startR}_${c}`;
      if (!seen.has(vKey)) {
        const squares = [];
        let rr = startR;
        while (rr <= 14 && this.#board[`${rr}_${c}`] !== null) {
          squares.push(`${rr}_${c}`);
          rr++;
        }
        if (squares.length > 1) {
          seen.add(vKey);
          const word = squares.map(sq => this.getTileLetter(this.#board[sq])).join('');
          words.push({ word, direction: 'V', startRow: startR, startCol: c, squares });
        }
      }
    }

    return words;
  }

  validatePlay(dictionary = null) {
    const played = this.getPlayedPositions();

    if (played.length === 0) {
      return { valid: true, isPass: true, words: [] };
    }

    // Ensure all newly placed blank tiles have a letter chosen
    for (const { tileId } of played) {
      if (this.isBlankTile(tileId) && !this.#blankLetters[tileId]) {
        return { valid: false, msg: "Please choose a letter for each blank tile." };
      }
    }

    // Center square must be covered
    if (!this.isTileOnCenterSquare()) {
      return { valid: false, msg: "A tile needs to be placed in the center square." };
    }

    // All newly placed tiles must lie in a single row or a single column
    const allSameRow = played.every(p => p.r === played[0].r);
    const allSameCol = played.every(p => p.c === played[0].c);

    if (!allSameRow && !allSameCol) {
      return { valid: false, msg: "All tiles played in a turn must be placed in a single row or column." };
    }

    // Contiguity: no empty gaps between the first and last newly placed tile
    if (played.length > 1) {
      if (allSameRow) {
        const r = played[0].r;
        const minC = Math.min(...played.map(p => p.c));
        const maxC = Math.max(...played.map(p => p.c));
        for (let c = minC; c <= maxC; c++) {
          if (this.#board[`${r}_${c}`] === null) {
            return { valid: false, msg: "Tiles must form a continuous line with no gaps." };
          }
        }
      } else {
        const c = played[0].c;
        const minR = Math.min(...played.map(p => p.r));
        const maxR = Math.max(...played.map(p => p.r));
        for (let r = minR; r <= maxR; r++) {
          if (this.#board[`${r}_${c}`] === null) {
            return { valid: false, msg: "Tiles must form a continuous line with no gaps." };
          }
        }
      }
    }

    // First turn must be at least 2 letters; later turns must attach to an existing committed tile
    if (this.isFirstMove()) {
      if (played.length < 2) {
        return { valid: false, msg: "The first word must be at least two letters long." };
      }
    } else {
      const touchesCommitted = played.some(({ r, c }) => {
        const neighbors = [
          [r - 1, c],
          [r + 1, c],
          [r, c - 1],
          [r, c + 1]
        ];
        return neighbors.some(([nr, nc]) => {
          if (nr < 0 || nr > 14 || nc < 0 || nc > 14) {
            return false;
          }
          const key = `${nr}_${nc}`;
          return this.#board[key] !== null && this.#playedTiles[key] === null;
        });
      });

      if (!touchesCommitted) {
        return { valid: false, msg: "Words need to be connected to existing words." };
      }
    }

    const formedWords = this.getFormedWords();
    if (formedWords.length === 0) {
      return { valid: false, msg: "Words must be at least two letters long." };
    }

    if (dictionary && dictionary.isEnabled()) {
      const invalidWords = formedWords
        .map(w => w.word)
        .filter(word => !dictionary.isValidWord(word));

      if (invalidWords.length > 0) {
        const formatted = [...new Set(invalidWords)].map(w => w.toUpperCase()).join(', ');
        return { valid: false, msg: `Invalid word(s): ${formatted}.` };
      }
    }

    return { valid: true, isPass: false, words: formedWords };
  }

  score() {
    let score = 0;
    const formedWords = this.getFormedWords();

    for (const { squares } of formedWords) {
      let wordScore = 0;
      let wordMultiplier = 1;

      for (const square of squares) {
        let tileScore = this.getTile(this.#board[square]).score;

        if (this.#playedTiles[square] !== null) {
          if (doubleLetters.has(square)) {
            tileScore *= 2;
          } else if (tripleLetters.has(square)) {
            tileScore *= 3;
          } else if (doubleWords.has(square)) {
            wordMultiplier *= 2;
          } else if (tripleWords.has(square)) {
            wordMultiplier *= 3;
          }
        }

        wordScore += tileScore;
      }

      score += wordScore * wordMultiplier;
    }

    // Official Scrabble Bingo bonus: +50 only when all 7 tiles are played in a single turn
    if (this.getPlayedPositions().length === 7) {
      score += 50;
    }

    return score;
  }

  swapTiles(player, tileIds) {
    if (this.getPlayedPositions().length > 0) {
      return { ok: false, msg: "Return placed tiles to your tray before swapping." };
    }

    const uniqueIds = Array.isArray(tileIds) ? [...new Set(tileIds)] : [];

    // Selecting 0 tiles acts as a pass
    if (uniqueIds.length === 0) {
      this.recordPass();
      if (this.isStalemate()) {
        this.endGame(false);
      } else {
        this.resetPlayedTiles();
        this.updatePlayerTurn();
      }
      return { ok: true, passed: true };
    }

    if (!this.canSwap()) {
      return { ok: false, msg: "Cannot swap tiles when fewer than 7 tiles remain in the bag." };
    }

    if (uniqueIds.length > this.#tiles.length) {
      return { ok: false, msg: "Not enough tiles remaining in the bag to swap." };
    }

    for (const tileId of uniqueIds) {
      if (!player.hasTile(tileId)) {
        return { ok: false, msg: "You can only swap tiles currently in your tray." };
      }
    }

    // Draw replacement tiles BEFORE returning swapped tiles to the bag
    const returnedTiles = uniqueIds.map(id => this.getTile(id)).filter(Boolean);
    uniqueIds.forEach(id => player.removeTile(id));

    const gameTiles = [...this.#tiles];
    const drawnTiles = [];
    for (let i = 0; i < returnedTiles.length; i++) {
      const rand = Math.floor(Math.random() * gameTiles.length);
      drawnTiles.push(...gameTiles.splice(rand, 1));
    }

    returnedTiles.forEach(tile => gameTiles.push(tile));
    this.#tiles = gameTiles;

    player.addTiles(drawnTiles);
    player.updatePlayerTiles();

    this.recordPass();
    if (this.isStalemate()) {
      this.endGame(false);
    } else {
      this.resetPlayedTiles();
      this.updatePlayerTurn();
    }

    return { ok: true, passed: false };
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

  setBlankLetter(tile_id, letter) {
    if (!this.isBlankTile(tile_id)) {
      return false;
    }
    if (typeof letter !== 'string' || !/^[a-z]$/i.test(letter.trim())) {
      return false;
    }
    const isPlayedThisTurn = Object.values(this.#playedTiles).includes(tile_id);
    if (!isPlayedThisTurn) {
      return false;
    }

    const normalized = letter.trim().toLowerCase();
    this.#blankLetters[tile_id] = normalized;
    this.players.forEach(player => player.socket.emit('blankLetter', { tile: tile_id, letter: normalized }));
    return true;
  }

  updatePlayerTurn() {
    if (this.getNumberOfPlayers() === 0) {
      return;
    }

    if (this.playerTurnIndex === undefined) {
      this.#playerTurnIndex = 0;
    } else if (this.playerTurnIndex + 1 < this.getNumberOfPlayers()) {
      this.#playerTurnIndex = this.playerTurnIndex + 1;
    } else {
      this.#playerTurnIndex = 0;
    }

    let turn = this.players[this.playerTurnIndex].id;
    console.log("Updating player turn", turn);
    this.players.forEach(player => player.socket.emit('turn', { turn: turn }));
  }

  updateBoard(tile, square, blankLetter = null) {
    if (!Object.prototype.hasOwnProperty.call(this.#board, square)) {
      return false;
    }

    if (tile !== null) {
      // Cannot place onto an already occupied square
      if (this.#board[square] !== null) {
        return false;
      }
      if (!this.getTile(tile)) {
        return false;
      }
    } else {
      // Cannot remove a tile committed in a previous turn
      if (this.#board[square] !== null && this.#playedTiles[square] === null) {
        return false;
      }
      const prevTile = this.#board[square];
      if (prevTile && this.isBlankTile(prevTile)) {
        delete this.#blankLetters[prevTile];
      }
    }

    console.log("Updating board", tile, square);
    let nextBoard = { ...this.#board };
    nextBoard[square] = tile;
    this.#board = nextBoard;

    let nextPlayedTiles = { ...this.#playedTiles };
    nextPlayedTiles[square] = tile;
    this.#playedTiles = nextPlayedTiles;

    let assignedLetter = null;
    if (tile && this.isBlankTile(tile)) {
      if (typeof blankLetter === 'string' && /^[a-z]$/i.test(blankLetter.trim())) {
        this.#blankLetters[tile] = blankLetter.trim().toLowerCase();
      }
      assignedLetter = this.#blankLetters[tile] || null;
    }

    this.players.forEach(player => player.socket.emit('update', { tile, square, blankLetter: assignedLetter }));
    return true;
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

    if (c !== 0) {
      if (this.findCenter(r, c - 1, wasHere)) return true;
    }
    if (c !== 14) {
      if (this.findCenter(r, c + 1, wasHere)) return true;
    }
    if (r !== 0) {
      if (this.findCenter(r - 1, c, wasHere)) return true;
    }
    if (r !== 14) {
      if (this.findCenter(r + 1, c, wasHere)) return true;
    }

    return false;
  }

  isTileOnCenterSquare() {
    return this.board["7_7"] !== null;
  }
}

Game.STATUS = {
  READY,
  SET,
  GO,
  FINAL,
  END
};

module.exports = Game;
