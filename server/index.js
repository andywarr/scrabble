var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path');

const Games = require('./games.js');
const Player = require('./player.js');

const READY = 0;
const SET = 1;
const GO = 2;

var games = new Games();

app.use('/static', express.static('./client/dist'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../client/dist/index.html'));
});

app.get('/play/:gameId', (req, res) => {
  var gameId = req.params.gameId;
  res.sendFile(path.resolve(__dirname + '/../client/dist/game.html'));
});

// Event executed when a player first opens a game
io.on('connection', (socket) => {
  console.log('New connection');

  var player = new Player(socket);
  var game = null;

  socket.on('addTile', (data) => {
    var tile_id = data.tile_id;
    var tile = game.getTile(tile_id);
    console.log(tile);
    player.addTile(tile);
  });

  socket.on('removeTile', (data) => {
    var tile_id = data.tile_id;
    player.removeTile(tile_id);
  });

  socket.on('done', () => {
    if (!game.isTileOnCenterSquare()) {
      console.log('A tile is not on the center square');
      player.socket.emit('issue', { code: 1, msg: "A tile needs to be placed in the center square." });
      return;
    }

    if (!game.isTileConnected()) {
      console.log('A tile is incorrectly placed');
      player.socket.emit('issue', { code: 1, msg: "Words need to be connected to existing words." });
      return;
    }

    let score = game.score();
    // TODO (andywarr): When scoring a game we can check for the check spelling of a word. If not correct we can return a score of null, which will indicate an invalid word
    player.updatePlayerScore(score);

    if(!game.isGameOver()) {
      console.log('Player turn complete');
      game.updatePlayers();
      game.resetPlayedTiles();
      game.updatePlayerTurn();
      game.drawTiles();
    } else {
      console.log('Game over');
      game.endGame();
    }
  });

  socket.on('game', (data) => {
    var gameId = data.gameId;
    game = games.getGame(gameId);

    if(!game) {
      console.log('Game does not exist');
      game = games.createGame(gameId);
    }

    if (game.getNumberOfPlayers() < 4) {
        game.addPlayer(player);

        if (game.getNumberOfPlayers() >= 2) {
          game.status = SET;
        }

        game.updatePlayers();
        game.updateStatus();
    } else {
      // Maximum number of players
      player.socket.emit('issue', { msg: "full" });
    }
  });

  socket.on('name', (data) => {
    let name = data.name;

    if (name) {
      player.name = name;
    }

    game.updatePlayers();
  });

  socket.on('status', (data) => {
    let status = data.status;

    if (status === GO) {
      game.status = GO;
      // START GAME
      game.updatePlayerTurn();
      game.drawTiles();
    }

    game.updateStatus();
  });

  socket.on('swap', (data) => {
    game.getTiles(player);

    data.forEach((tile_id) => {
      let tile = game.getTile(tile_id);
      game.addTile(tile);
    });

    console.log('Player turn complete');
    game.resetPlayedTiles();
    game.updatePlayerTurn();
    game.drawTiles();
  });

  socket.on('update', (data) => {
    let tile = data.tile;
    let square = data.square;

    game.updateBoard(tile, square);
  });

  // Event emitted when a player exits a game
  socket.on('disconnect', () => {
    console.log('Player disconnected');
    if (game) {
      game.removePlayer(player.id);
    }

    if (game.status === READY) {
      if (game.getNumberOfPlayers() === 0) {
        // Remove game
        games.removeGame(game.id);
      }
    } else if (game.status === SET) {
      if (game.getNumberOfPlayers() === 0) {
        // Remove game
        games.removeGame(game.id);
      } else if (game.getNumberOfPlayers() === 1) {
        // Change status to staged
        game.status = READY;
        game.updateStatus();
      }
    }  else if (game.status >= GO) {
      if (game.getNumberOfPlayers() === 0) {
        // Remove game
        games.removeGame(game.id);
      } else if (game.getNumberOfPlayers() === 1) {
        // The remaining player is the winner
      }
    }
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
