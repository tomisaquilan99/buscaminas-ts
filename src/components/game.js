import { Button, Modal, Typography, styled, Box } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useState } from "react";
import Board from "./board";

const generateBoard = (rows, cols, numBombs) => {
  const board = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ value: 0, revealed: false }))
  );

  // Distribuir bombas de manera aleatoria
  let bombsPlaced = 0;
  while (bombsPlaced < numBombs) {
    const randomRow = Math.floor(Math.random() * rows);
    const randomCol = Math.floor(Math.random() * cols);

    if (board[randomRow][randomCol].value !== "bomb") {
      board[randomRow][randomCol].value = "bomb";
      bombsPlaced++;
    }
  }

  // Calcular los números de las celdas adyacentes
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (board[row][col].value === "bomb") continue;

      const adjacentCells = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ];

      let numAdjacentBombs = 0;
      adjacentCells.forEach(([dx, dy]) => {
        const newRow = row + dx;
        const newCol = col + dy;
        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
          if (board[newRow][newCol].value === "bomb") {
            numAdjacentBombs++;
          }
        }
      });

      board[row][col].value = numAdjacentBombs;
    }
  }

  return board;
};

const Game = () => {
  const [board, setBoard] = useState(generateBoard(10, 10, 10));
  const [difficulty, setDifficulty] = useState("PRINCIPIANTE");
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleClose = () => setModalOpen(false);

  const handleCellClick = (rowIndex, colIndex) => {
    if (gameOver || board[rowIndex][colIndex].revealed) {
      return;
    }
    if (board[rowIndex][colIndex].revealed) {
      return; // Evitar hacer clic en una celda ya revelada
    }

    const newBoard = [...board];
    newBoard[rowIndex][colIndex].revealed = true;

    const allNonBombCellsRevealed = newBoard
      .flat()
      .filter((cell) => cell.value !== "bomb")
      .every((cell) => cell.revealed);

    if (allNonBombCellsRevealed) {
      setVictory(true);
      setModalOpen(true);
    }

    if (newBoard[rowIndex][colIndex].value === "bomb") {
      // Manejar fin del juego: mostrar todas las bombas
      newBoard.forEach((row) =>
        row.forEach((cell) => {
          if (cell.value === "bomb") {
            cell.revealed = true;
          }
        })
      );
      setBoard(newBoard);
      setGameOver(true);
      setModalOpen(true);

      // Puedes mostrar un mensaje de "Perdiste" aquí
      return;
    }

    if (newBoard[rowIndex][colIndex].value === 0) {
      // Si la celda es un espacio vacío, revelar celdas adyacentes automáticamente
      const revealAdjacent = (row, col) => {
        if (
          row < 0 ||
          row >= newBoard.length ||
          col < 0 ||
          col >= newBoard[0].length
        ) {
          return;
        }

        if (!newBoard[row][col].revealed) {
          newBoard[row][col].revealed = true;

          if (newBoard[row][col].value === 0) {
            adjacentCells.forEach(([dx, dy]) => {
              revealAdjacent(row + dx, col + dy);
            });
          }
        }
      };

      const adjacentCells = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ];

      revealAdjacent(rowIndex, colIndex);
    }

    setBoard(newBoard);
  };

  const generateNewBoardWithDiffilcuty = (difficulty) => {
    let bombs = 10;
    if (difficulty === "INTERMEDIO") {
      bombs = 30;
    } else if (difficulty === "DIFICIL") {
      bombs = 50;
    }
    setBoard(generateBoard(10, 10, bombs));
    setDifficulty(difficulty);
    setGameOver(false);
    setVictory(false);
  };

  console.log(modalOpen);
  console.log(victory);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1>Buscaminas</h1>
      <Button
        onClick={() => {
          if (difficulty === "PRINCIPIANTE") {
            setBoard(generateBoard(10, 10, 10));
          } else if (difficulty === "INTERMEDIO") {
            setBoard(generateBoard(10, 10, 30));
          } else setBoard(generateBoard(10, 10, 50));
          setGameOver(false);
          setVictory(false);
        }}
      >
        Reiniciar juego
      </Button>
      <Stack flexDirection={"row"} margin={2} gap={5}>
        <Button
          onClick={() => {
            generateNewBoardWithDiffilcuty("PRINCIPIANTE");
          }}
        >
          Nivel principiante
        </Button>
        <Button
          onClick={() => {
            generateNewBoardWithDiffilcuty("INTERMEDIO");
          }}
        >
          Nivel intermedio
        </Button>
        <Button
          onClick={() => {
            generateNewBoardWithDiffilcuty("DIFICIL");
          }}
        >
          Nivel dificil
        </Button>
      </Stack>

      <Board
        board={board}
        onCellClick={handleCellClick}
        gameOver={gameOver}
        victory={victory}
      />
      {gameOver && (
        <Modal open={modalOpen} onClose={() => handleClose}>
          <CustomBox>
            <Box display={"flex"} justifyContent={"end"}>
              <Button onClick={handleClose}>X</Button>
            </Box>
            <Box>
              <Typography textAlign={"center"} fontSize={20}>
                Has Perdido :(
              </Typography>
            </Box>
          </CustomBox>
        </Modal>
      )}
      {victory && (
        <Modal open={modalOpen} onClose={() => handleClose}>
          <CustomBox>
            <Box display={"flex"} justifyContent={"end"}>
              <Button onClick={handleClose}>X</Button>
            </Box>
            <Box>
              <Typography textAlign={"center"} fontSize={20}>
                Has Ganado :D
              </Typography>
            </Box>
          </CustomBox>
        </Modal>
      )}

      {victory && <Typography>Has ganado :D</Typography>}
    </div>
  );
};

export default Game;

const CustomBox = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: "white",
  paddingBottom: 30,
  border: "1px solid #000",
  borderRadius: 10,
  boxShadow: 24,
  p: 4,
});
