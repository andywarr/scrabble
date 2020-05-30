import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';

import '../css/game.scss';

const Index = () => {
  return <div>Welcome to React!</div>;
};
ReactDOM.render(<Index />, document.getElementById('root'));

const socket = io();

socket.on('connect', () => {
  var gameId = getGameId();
  var playerId = getPlayerId(socket);

  updateLink();

  socket.emit('game', { gameId: gameId });
});

socket.on('status', (data) => {
  console.log(data);

  if (data.status === "Staged") {
    document.getElementById("modal-overlay").classList.remove("closed");
    document.getElementById("share-modal").classList.remove("closed");
  } else if (data.status === "Ready") {
    document.getElementById("modal-overlay").classList.add("closed");
    document.getElementById("share-modal").classList.add("closed");
  }
});

socket.on('issue', (data) => {
  console.log(data);
});

var copy = function() {
  var copyText = document.querySelector("#game-link");
  copyText.select();
  document.execCommand("copy");

  document.querySelector("#copy-game-link").value = "Copied";
  setTimeout(function(){
    document.querySelector("#copy-game-link").value = "Copy";
  }, 3000);
}

var getGameId = function() {
  return window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
}

var getPlayerId = function(socket) {
  return socket.id;
}

var updateLink = function() {
  document.getElementById("game-link").value = window.location.href;
}
