import React, { useState, useEffect } from 'react';
import './TicTacToe.css';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [isSinglePlayer, setIsSinglePlayer] = useState(null);
  const [lastWinner, setLastWinner] = useState(null);
  const [gameStats, setGameStats] = useState({ X: 0, O: 0, draws: 0 });
  const [showStats, setShowStats] = useState(false);
  const winner = calculateWinner(board);

  useEffect(() => {
    if (isSinglePlayer && !isXNext && !winner) {
      makeComputerMove(board);
    }
  }, [isXNext, isSinglePlayer, winner, board]);

  useEffect(() => {
    if (lastWinner === 'O' && isSinglePlayer) {
      setIsXNext(false);
    }
  }, [lastWinner, isSinglePlayer]);

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const newWinner = calculateWinner(newBoard);
    if (newWinner) {
      setLastWinner(newBoard[index]);
      updateGameStats(newWinner);
    } else if (!newBoard.includes(null)) {
      updateGameStats('draw');
    }
  };

  const makeComputerMove = (currentBoard) => {
    const emptyIndices = currentBoard.reduce((acc, val, idx) => (val === null ? acc.concat(idx) : acc), []);
    if (emptyIndices.length === 0) return;

    const bestMove = findBestMove(currentBoard);
    const newBoard = [...currentBoard];
    newBoard[bestMove] = 'O';
    setBoard(newBoard);
    setIsXNext(true);

    const newWinner = calculateWinner(newBoard);
    if (newWinner) {
      setLastWinner('O');
      updateGameStats('O');
    }
  };

  const findBestMove = (currentBoard) => {
    for (let i = 0; i < currentBoard.length; i++) {
      if (currentBoard[i] === null) {
        currentBoard[i] = 'O';
        if (calculateWinner(currentBoard) === 'O') {
          return i;
        }
        currentBoard[i] = null;
      }
    }
    for (let i = 0; i < currentBoard.length; i++) {
      if (currentBoard[i] === null) {
        currentBoard[i] = 'X';
        if (calculateWinner(currentBoard) === 'X') {
          currentBoard[i] = null;
          return i;
        }
        currentBoard[i] = null;
      }
    }
    const emptyIndices = currentBoard.reduce((acc, val, idx) => (val === null ? acc.concat(idx) : acc), []);
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  };

  const updateGameStats = (winner) => {
    setGameStats((prevStats) => {
      if (winner === 'X') {
        return { ...prevStats, X: prevStats.X + 1 };
      } else if (winner === 'O') {
        return { ...prevStats, O: prevStats.O + 1 };
      } else if (winner === 'draw') {
        return { ...prevStats, draws: prevStats.draws + 1 };
      } else {
        return prevStats;
      }
    });
  };

  const renderSquare = (index) => {
    return (
      <button className={`square ${board[index]}`} onClick={() => handleClick(index)}>
        {board[index]}
      </button>
    );
  };

  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(lastWinner !== 'X');
  };

  const handleGameModeSelection = (mode) => {
    setIsSinglePlayer(mode === 'single');
    setIsXNext(true);
  };

  const handleEndGame = () => {
    setShowStats(true);
  };

  const handleCloseStats = () => {
    setShowStats(false);
    setGameStats({ X: 0, O: 0, draws: 0 });
    setBoard(Array(9).fill(null));
    setIsSinglePlayer(null);
  };

  if (isSinglePlayer === null) {
    return (
      <div className="game-mode-popup">
        <h2>Seleziona Modalità di Gioco</h2>
        <button className="single-player" onClick={() => handleGameModeSelection('single')}>Giocatore Singolo</button>
        <button className="multiplayer" onClick={() => handleGameModeSelection('multi')}>Multiplayer</button>
      </div>
    );
  }

  return (
    <div className="tic-tac-toe">
      <h1>Tic-Tac-Toe</h1>
      <div className="board">
        {board.map((_, index) => renderSquare(index))}
      </div>
      <div className="status">
        {winner ? `Vincitore: ${winner}` : `Prossimo giocatore: ${isXNext ? 'X' : 'O'}`}
      </div>
      <button className="button reset" onClick={handleReset}>Reset</button>
      <button className="button end-game" onClick={handleEndGame}>Fine Gioco</button>
      {showStats && (
        <div className="game-mode-popup">
          <h2>Statistiche di Gioco</h2>
          <p>Vittorie X: {gameStats.X}</p>
          <p>Vittorie O: {gameStats.O}</p>
          <p>Pareggi: {gameStats.draws}</p>
          <button className="button end-game" onClick={handleCloseStats}>Chiudi</button>
        </div>
      )}
    </div>
  );
};

const calculateWinner = (squares) => {
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
      return squares[a];
    }
  }
  return null;
};

export default TicTacToe;
