import React, { Component } from "react";
import ReactDOM from "react-dom";

import '../../css/game.scss';

class Player extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <li className="player">
        <div className="player-profile-image">
          <svg width="50" height="50" viewBox="0 0 100 113" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="49" stroke="#FEFEFE" strokeWidth="4"/>
          <path d="M85.7107 77.3553C66.1845 57.8291 34.5262 57.8291 15 77.3553" stroke="#FEFEFE" strokeWidth="4"/>
          <circle cx="50" cy="37.5" r="24" stroke="#FEFEFE" strokeWidth="4"/>
          </svg>
        </div>
        <div className="column">
          <div>{this.props.name}</div>
          <div>{this.props.score}</div>
        </div>
      </li>
    );
  }
}

export default Player;
