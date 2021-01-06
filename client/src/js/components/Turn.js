import React from 'react';
import { status } from '../config.js';

import '../../css/game.scss';

export default function Turn(props) {

  function isTurn() {
    if (props.playerId === props.turn) {
      if(props.swap) {
        return Swap();
      } else {
        return Turn();
      }
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
        <p>It's your turn.</p>
        <p>Drag tiles from your tray onto the board to spell words.</p>
        <p>If you do not drag any tiles onto the board you will have the option to swap all or some of your tiles.</p>
        <p>When you have finished spelling words or you want to swap tiles, press 'Done'</p>
        <p className="error">{props.errorMsg}</p>
        <input onClick={() => props.done()}
               type="button"
               value="Done" />
      </div>
    );
  }

  function NotTurn() {
    return <p>Please wait while other players take their turn.</p>;
  }

  function Swap() {
    return (
      <div>
        <p>Select the tiles in your tray that you wish to swap.</p>
        <p>When you have finished selecting the tiles you wish to swap, if any, press 'Done'.</p>
        <input onClick={() => props.done()}
               type="button"
               value="Done" />
      </div>
    );
  }

  return (
    <div id="player-info-container" className={isVisible() ? "" : "closed"}>
    {isTurn()}
    </div>
  )
}
