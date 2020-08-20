import React, { Component } from "react";
import ReactDOM from "react-dom";

class Start extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log("render", this.props.isVisible);
    return (
      <div>
        <p>TEST</p>
      </div>
    );
  }
}

export default Start;
