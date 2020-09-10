import React, { Component } from "react";
import ReactDOM from "react-dom";

import { status } from '../config.js';

import '../../css/game.scss';

class Share extends Component {
  constructor(props) {
    super(props);

    this.copy = this.copy.bind(this);
  }

  copy() {
    var copyText = document.querySelector("#game-link");
    copyText.select();
    document.execCommand("copy");

    document.querySelector("#copy-game-link").value = "Copied";
    setTimeout(function(){
      document.querySelector("#copy-game-link").value = "Copy";
    }, 3000);
  }

  isVisible() {
    let visible = false;

    if (this.props.status === status.READY) {
      visible = true;
    }

    return visible;
  }

  render() {
    return (
      <div className={this.isVisible() ? "" : "closed"}>
        <div className="modal-overlay" id="modal-overlay"></div>

        <div className="modal" id="share-modal">
          <div className="modal-container">
            <h1>Share</h1>
            <p>Send the link below with up to three friend. You will be able to play the game once others join.</p>
            <form id="game-link-container">
              <input id="game-link" type="text" value={window.location.href} readOnly />
              <input id="copy-game-link" value="Copy" type="button" onClick={this.copy} />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Share;
