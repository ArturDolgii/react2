import React from "react";
import Square from "../Square";
import "./index.css";

class Board extends React.Component {
  renderSquare(i) {
    return <Square key={i}
                   value={this.props.squares[i]}
                   onClick={()=>this.props.onClick(i)}/>;
  }

  createBoard() {
    let rows = [];
    let count = -1

    Array(3).fill(null).forEach((item, i) => {
      let cells = [];

      Array(3).fill(null).forEach((item, j) => {
        ++count;
        cells.push(this.renderSquare(count));
      });

      rows.push(<div key={i} className="board-row">{cells}</div>);
    })

    return rows;
  }

  render() {
    return (
      <div>
        {this.createBoard()}
      </div>
    );
  }
}

export default Board;
