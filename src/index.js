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
          index: 0
        }
      ],
      activeIndex: 0,
      sort: "ASC",
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice().filter(item => item.index <= this.state.activeIndex);
    const current = history.filter(item => item.index === this.state.activeIndex)[0];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    const newItem = [{
      squares: squares,
      axis: this.getAxis(i),
      index: history.length
    }];
    this.setState({
      history: this.state.sort === "ASC" ? [...history, ...newItem] : [...newItem, ...history],
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

  switchSortTo(sort) {
    this.setState({
      sort,
      history: this.state.history.slice().reverse()
    });
  }

  render() {
    const history = this.state.history;
    const current = history.filter(item => item.index === this.state.activeIndex)[0];
    const winner = calculateWinner(current.squares);

    const moves = history.map(step => {
      const isActive = this.state.activeIndex === step.index;
      const desc = step.index ?
        `Go to move #${step.index} (${step.axis.y}x${step.axis.x})` :
        'Go to game start';
      return (
        <li key={step.index}>
          <button
            onClick={() => this.jumpTo(step.index)}
            style={{fontWeight: isActive ? "bold" : ""}}>
              {desc}
            </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner.gamer;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    let switcher;
    if (history.length > 1) {
      let button;
      if (this.state.sort === "ASC") {
        button = <button onClick={() => this.switchSortTo("DESC")}>DESC</button>;
      } else {
        button = <button onClick={() => this.switchSortTo("ASC")}>ASC</button>;
      }
      switcher = <div>Sort: {button}</div>;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winnerIndexes={winner ? winner.winnerIndexes : null}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          {switcher}
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
      return { gamer: squares[a], winnerIndexes: [a, b, c] };
    }
  }
  return null;
}
