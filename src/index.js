import React from 'react';
import ReactDOM from 'react-dom';
import Switch from "react-switch";
import './index.css';

function Square(props) {
    return (
        <button className="square" style={{ background: props.winner ? "yellow" : "white" }} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { a, b, c };
        }
    }
    return null;
}

function checkIfThereIsEmpty(squares) {
    console.log(squares.includes(null));
    return squares.includes(null);
}

class Board extends React.Component {
    renderSquare(i, isWinner) {
        return <Square key={i} value={this.props.squares[i]} winner={isWinner} onClick={() => this.props.onClick(i)} />;
    }

    render() {
        let board = [];
        for (let i = 0; i < 3; i++) {
            let row = [];
            for (let j = 0; j < 3; j++) {
                if (this.props.winner && (i * 3 + j === this.props.winner.a || i * 3 + j === this.props.winner.b || i * 3 + j === this.props.winner.c)) {
                    row.push(this.renderSquare(i * 3 + j, true));
                }
                else {
                    row.push(this.renderSquare(i * 3 + j, false));
                }
            }
            board.push(<div className="board-row" key={i}>{row}</div>)
        }
        return (<div>{board}</div>);
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                winner: null
            }],
            xIsNext: true,
            stepNumber: 0,
            lastMove: [],
            checked: false,
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(checked) {
        this.setState({ checked });
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice();
        const winner = calculateWinner(squares);
        if (winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({ history: history.concat([{ squares: squares, winner: winner }]), xIsNext: !this.state.xIsNext, stepNumber: history.length, lastMove: this.state.lastMove.concat([i]) });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            lastMove: this.state.lastMove.slice(0, step),
            history: this.state.history.slice(0, step + 1)
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber]
        const winner = calculateWinner(current.squares);
        const checkDraw = checkIfThereIsEmpty(current.squares);

        const moves = history.map((step, move) => {
            let pos = "";
            if (move) {
                pos = ' (' + Math.floor(this.state.lastMove.at(move - 1) / 3) + ', ' + this.state.lastMove.at(move - 1) % 3 + ')';
            }
            const moveString = move ? "Go to move #" + move + pos : 'Go to game start'
            const desc = this.state.stepNumber === move ? <strong>{moveString}</strong> : moveString;

            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        })

        let status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        if (winner) {
            status = "Winner: " + current.squares[winner.a];
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} winner={winner}
                        onClick={(i) => this.handleClick(i)} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <Switch uncheckedIcon={false} checkedIcon={false} onChange={this.handleChange} checked={this.state.checked} />
                    <ol>{this.state.checked ? moves.reverse() : moves}</ol>
                    <div>
                        {!checkDraw ? "GAME DRAW" : ""}
                    </div>
                </div>
            </div>
        );
    }
}


ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
