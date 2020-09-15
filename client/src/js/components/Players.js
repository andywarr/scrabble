import React from 'react';

// Import components
import Player from "./Player";

import '../../css/game.scss';

export default function Players(props) {

  return (
    <ul id="players">
      {props.players.map((player, index) =>
        <Player id={player.id}
                index={index + 1}
                key={player.id}
                name={player.name}
                playerId={props.playerId}
                score={player.score}
                setName={props.setName} />
      )}
    </ul>
  );
}
