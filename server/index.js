var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path');

const Games = require('./games.js');
const Player = require('./player.js');

var games = new Games();

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

app.get('/play/:gameId', (req, res) => {
  var gameId = req.params.gameId;
  res.sendFile(path.resolve(__dirname + '/../client/game.html'));
});

// Event executed when a player first opens a game
io.on('connection', (socket) => {
  console.log('New connection');

  var player = new Player(socket);
  var game = null;

  socket.on('game', (data) => {
    var gameId = data.gameId;
    game = games.getGame(gameId);

    if(!game) {
      console.log('Game does not exist');
      game = games.createGame(gameId);
    }

    game.addPlayer(player);

    if (game.getNumberOfPlayers() >= 2) {
      game.status = 'Ready';
      game.updateStatus();
    }
  });

  // Event emitted when a player exits a game
  socket.on('disconnect', () => {
    console.log('Player disconnected');
    if (game) {
      game.removePlayer(player.id);
    }

    if (game.status === 'Staged') {
      if (game.getNumberOfPlayers() === 0) {
        // Remove game
        games.removeGame(game.id);
      }
    } else if (game.status === 'Ready') {
      if (game.getNumberOfPlayers() === 0) {
        // Remove game
        games.removeGame(game.id);
      } else if (game.getNumberOfPlayers() === 1) {
        // Change status to staged
        game.status = 'Staged';
        game.updateStatus();
      }
    }  else if (game.status === 'Playing') {
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
