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

  socket.on('done', () => {
    console.log('Player turn complete');
    game.updatePlayerTurn();
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
    }

    game.updateStatus();
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
    }  else if (game.status === GO) {
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

var getGameId = function() {
  socket.emit('gameId');
};
