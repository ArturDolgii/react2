import React from "react";
import ReactDOM from 'react-dom';
import Board from "./Board";
import "./index.css";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          axis: { y : null, x: null },
        }
      ],
      activeIndex: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.filter((item, i) => i <= this.state.activeIndex);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          axis: this.getAxis(i)
        }
      ]),
      activeIndex: this.state.activeIndex + 1,
      xIsNext: !this.state.xIsNext
    });
  }

  getAxis(i) {
      return {
          y: (i % 3) + 1,
          x: Math.round((i + 2) / 3)
      };
  }

  jumpTo(step) {
    this.setState({
      activeIndex: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history.filter((item, i) => i === this.state.activeIndex)[0];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const isActive = this.state.activeIndex === move;
      const desc = move ?
        `Go to move #${move} (${step.axis.y}x${step.axis.x})` :
        'Go to game start';
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            style={{fontWeight: isActive ? "bold" : ""}}>
              {desc}
            </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
