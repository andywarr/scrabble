import React from 'react';
import { status } from '../config.js';

import '../../css/game.scss';

export default function End(props) {

  function isVisible() {
    return props.status === status.END;
  }

  const players = Array.isArray(props.players) ? [...props.players] : [];
  const ranked = players.sort((a, b) => b.score - a.score);
  const topScore = ranked.length > 0 ? ranked[0].score : null;
  const winners = ranked.filter((p) => p.score === topScore);

  const winnerText =
    winners.length === 0
      ? ""
      : winners.length === 1
        ? `Winner: ${winners[0].name || "Player"} (${winners[0].score} pts)`
        : `Tie: ${winners.map((w) => w.name || "Player").join(", ")} (${topScore} pts)`;

  return (
    <div className={isVisible() ? "" : "closed"}>
      <div className="modal-overlay" id="modal-overlay"></div>

      <div className="modal">
        <div className="modal-container">
          <h1>GAME OVER</h1>
          {winnerText ? <p className="winner-banner">{winnerText}</p> : null}
          <ol className="final-scores">
            {ranked.map((player, idx) => (
              <li key={player.id}>
                {player.name || `Player ${idx + 1}`}: {player.score} pts
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
