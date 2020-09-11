import React, { Component } from "react";
import ReactDOM from "react-dom";

// Import components
import Player from "./Player";

import '../../css/game.scss';

class Players extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ul id="players">
        {this.props.players.map((player, index) =>
          <Player id={player.id}
                  index={index + 1}
                  key={player.id}
                  name={player.name}
                  playerId={this.props.playerId}
                  score={player.score}
                  setName={this.props.setName} />
        )}
    </ul>
    );
  }
}

export default Players;
