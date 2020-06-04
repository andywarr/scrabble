import React, { Component } from "react";
import ReactDOM from "react-dom";

import '../../css/game.scss';

class Share extends Component {
  constructor() {
    super();

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

  render() {
    return (
      <div>
        <div className="modal-overlay closed" id="modal-overlay"></div>

        <div className="modal closed" id="share-modal">
          <div className="modal-container">
            <h1>Share</h1>
            <p>Send the link below with up to three friend. You will be able to play the game once others join.</p>
            <form id="game-link-container">
              <input id="game-link" type="text" value="Loading..." readOnly />
              <input id="copy-game-link" value="Copy" type="button" onClick={this.copy} />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Share;
