import React from 'react';
import { status } from '../config.js';

import '../../css/game.scss';

export default function End(props) {

  function isVisible() {
    let visible = false;

    if (props.status === status.END) {
      visible = true;
    }

    return visible;
  }

  return (
    <div className={isVisible() ? "" : "closed"}>
      <div className="modal-overlay" id="modal-overlay"></div>

      <div className="modal">
        <p>GAME OVER</p>
      </div>
    </div>
  );
}
