import React from "react";
import Square from "../Square";
import "./index.css";

class Board extends React.Component {
  render() {
    return (
      <button className="square" onClick={this.props.onClick}>
        {this.props.value}
      </button>
    );
  }
}

export default Board;
