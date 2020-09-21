import React from 'react';
import { status } from '../config.js';

import '../../css/game.scss';

export default function Set(props) {

  function isVisible() {
    let visible = false;

    if (props.status === status.SET) {
      visible = true;
    }

    return visible;
  }

  return (
    <div id="player-info-container" className={isVisible() ? "" : "closed"}>
      <p>Waiting for players to join. Once all players have joined, please the Start button. New players cannot join the game once it has started.</p>
      <input onClick={() => props.setStatus(status.GO)}
             type="button"
             value="Start" />
    </div>
  );
}
