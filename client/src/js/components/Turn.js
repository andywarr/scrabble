import React from 'react';
import { status } from '../config.js';

import '../../css/game.scss';

export default function Turn(props) {

  function isTurn() {
    if (props.playerId === props.turn) {
      return Turn();
    }
    else {
      return NotTurn();
    }
  }

  function isVisible() {
    let visible = false;

    if (props.status === status.GO) {
      visible = true;
    }

    return visible;
  }

  function Turn() {
    return (
      <div>
        <p>It's your turn. Once you have completed your turn, press the Done button.</p>
        <p>{props.errorMsg}</p>
        <input onClick={() => props.done()}
               type="button"
               value="Done" />
      </div>
    )
  }

  function NotTurn() {
    return <p>Please wait while other players take their turn.</p>;
  }

  return (
    <div id="player-info-container" className={isVisible() ? "" : "closed"}>
    {isTurn()}
    </div>
  )
}
