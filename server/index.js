var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path');

const Dictionary = require('./dictionary.js');
const Game = require('./game.js');
const Games = require('./games.js');
const Player = require('./player.js');

const { READY, SET, GO, FINAL } = Game.STATUS;

var dictionary = new Dictionary();
var games = new Games();

app.use('/static', express.static('./client/dist'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../client/dist/index.html'));
});

app.get('/play/:gameId', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../client/dist/game.html'));
});

// Event executed when a player first opens a game
io.on('connection', (socket) => {
  console.log('New connection');

  var player = new Player(socket);
  var game = null;

  function isActiveTurn() {
    if (!game) {
      return false;
    }
    if (game.status !== GO && game.status !== FINAL) {
      return false;
    }
    const currentPlayer = game.getPlayerTurn();
    return Boolean(currentPlayer && currentPlayer.id === player.id);
  }

  socket.on('addTile', (data) => {
    if (!isActiveTurn() || !data || !data.tile_id) {
      return;
    }
    var tile_id = data.tile_id;
    var tile = game.getTile(tile_id);
    if (!tile) {
      return;
    }
    const inBag = game.tiles.some(t => t.id === tile_id);
    const onBoard = Object.values(game.board).includes(tile_id);
    const ownedByOther = game.players.some(p => p.id !== player.id && p.hasTile(tile_id));
    if (inBag || onBoard || ownedByOther) {
      return;
    }
    console.log(tile);
    player.addTile(tile);
  });

  socket.on('removeTile', (data) => {
    if (!isActiveTurn() || !data || !data.tile_id) {
      return;
    }
    var tile_id = data.tile_id;
    player.removeTile(tile_id);
  });

  socket.on('blankLetter', (data) => {
    if (!isActiveTurn() || !data) {
      return;
    }
    game.setBlankLetter(data.tile, data.letter);
  });

  socket.on('done', () => {
    if (!isActiveTurn()) {
      return;
    }

    const validation = game.validatePlay(dictionary);
    if (!validation.valid) {
      console.log('Invalid play:', validation.msg);
      player.socket.emit('issue', { code: 1, msg: validation.msg });
      return;
    }

    if (validation.isPass) {
      console.log('Player passed turn');
      game.recordPass();
      if (game.isStalemate()) {
        console.log('Game over (stalemate)');
        game.endGame(false);
      } else {
        game.resetPlayedTiles();
        game.updatePlayerTurn();
      }
      return;
    }

    let score = game.score();
    player.updatePlayerScore(score);
    game.resetConsecutivePasses();

    if (!game.isOutOfTiles()) {
      console.log('Player turn complete');
      game.updatePlayers();
      game.resetPlayedTiles();
      game.getTiles(player);
      game.updatePlayerTurn();
    } else {
      console.log('Game over');
      game.endGame(true);
    }
  });

  socket.on('game', (data) => {
    if (game || !data || !data.gameId) {
      return;
    }

    var gameId = data.gameId;
    var targetGame = games.getGame(gameId);

    if (!targetGame) {
      console.log('Game does not exist');
      targetGame = games.createGame(gameId);
    }

    if (targetGame.status >= GO) {
      player.socket.emit('issue', { code: 2, msg: "This game has already started." });
      return;
    }

    if (targetGame.getNumberOfPlayers() >= 4) {
      player.socket.emit('issue', { code: 2, msg: "This game is full." });
      return;
    }

    game = targetGame;
    game.addPlayer(player);

    if (game.status === READY && game.getNumberOfPlayers() >= 2) {
      game.status = SET;
    }

    game.updatePlayers();
    game.updateStatus();
  });

  socket.on('name', (data) => {
    if (!game || !data || typeof data.name !== 'string') {
      return;
    }

    player.name = data.name;
    game.updatePlayers();
  });

  socket.on('status', (data) => {
    if (!game || !data) {
      return;
    }

    let status = data.status;

    if (status === GO && game.status === SET && game.getNumberOfPlayers() >= 2) {
      game.status = GO;
      // START GAME
      game.drawTiles();
      game.updatePlayerTurn();
      game.updateStatus();
    }
  });

  socket.on('swap', (data) => {
    if (!isActiveTurn()) {
      return;
    }

    const result = game.swapTiles(player, data);
    if (!result.ok) {
      player.socket.emit('issue', { code: 1, msg: result.msg });
    } else {
      console.log('Player swap/pass turn complete');
    }
  });

  socket.on('update', (data) => {
    if (!isActiveTurn() || !data) {
      return;
    }

    let tile = data.tile;
    let square = data.square;
    let blankLetter = data.blankLetter || null;

    game.updateBoard(tile, square, blankLetter);
  });

  // Event emitted when a player exits a game
  socket.on('disconnect', () => {
    console.log('Player disconnected');
    if (!game) {
      return;
    }

    const { shouldRemoveGame } = game.handleDisconnect(player.id);
    if (shouldRemoveGame) {
      games.removeGame(game.id);
    }
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
