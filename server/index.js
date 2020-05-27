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

  // Event executed when a player first joins a game
  socket.on('game', (data) => {
    var gameId = data.gameId;
    var game = games.getGame(gameId);

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
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});

var getGameId = function() {
  socket.emit('gameId');
};
