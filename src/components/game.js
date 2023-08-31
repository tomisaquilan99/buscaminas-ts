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
  const [board, setBoard] = useState(generateBoard(8, 8, 10));
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

    const revealAdjacentCells = (row, col) => {
      if (
        row < 0 ||
        row >= board.length ||
        col < 0 ||
        col >= board[0].length ||
        board[row][col].revealed
      ) {
        return;
      }

      const newBoard = [...board]; // Declarar newBoard aquí
      newBoard[row][col].revealed = true;

      if (board[row][col].value === 0) {
        const adjacentCells = [
          [-1, 0],
          [1, 0],
          [0, -1],
          [0, 1],
        ];

        adjacentCells.forEach(([dx, dy]) => {
          revealAdjacentCells(row + dx, col + dy);
        });
      }
      setBoard(newBoard); // Actualizar el estado después de revelar la celda
    };

    revealAdjacentCells(rowIndex, colIndex);

    const newBoard = [...board];
    newBoard[rowIndex][colIndex].revealed = true;
    setBoard(newBoard);

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

  const handleCellRightClick = (event, rowIndex, colIndex) => {
    console.log(event);
    event.preventDefault(); // Prevent default context menu
    // Handle right-click logic, e.g., placing a flag
    if (gameOver || victory || board[rowIndex][colIndex].revealed) {
      return;
    }

    const newBoard = [...board];
    const cell = newBoard[rowIndex][colIndex];
    cell.flagged = !cell.flagged;

    setBoard(newBoard);
  };

  const generateNewBoardWithDiffilcuty = (difficulty) => {
    let bombs = 10;
    let boardRows = 8;
    let boardCols = 8;
    if (difficulty === "INTERMEDIO") {
      bombs = 40;
      boardRows = 16;
      boardCols = 16;
    } else if (difficulty === "DIFICIL") {
      bombs = 99;
      boardRows = 16;
      boardCols = 30;
    }
    setBoard(generateBoard(boardRows, boardCols, bombs));
    setDifficulty(difficulty);
    setGameOver(false);
    setVictory(false);
  };

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
      <CustomReplayButton
        onClick={() => {
          if (difficulty === "PRINCIPIANTE") {
            setBoard(generateBoard(8, 8, 10));
          } else if (difficulty === "INTERMEDIO") {
            setBoard(generateBoard(16, 16, 40));
          } else setBoard(generateBoard(16, 30, 99));
          setGameOver(false);
          setVictory(false);
        }}
      >
        Reiniciar juego
      </CustomReplayButton>
      <Stack flexDirection={"row"} margin={2} gap={5}>
        <CustomButton
          onClick={() => {
            generateNewBoardWithDiffilcuty("PRINCIPIANTE");
          }}
          difficulty={difficulty}
        >
          Nivel principiante
        </CustomButton>
        <CustomButton
          onClick={() => {
            generateNewBoardWithDiffilcuty("INTERMEDIO");
          }}
          difficulty={difficulty}
        >
          Nivel intermedio
        </CustomButton>
        <CustomButton
          onClick={() => {
            generateNewBoardWithDiffilcuty("DIFICIL");
          }}
          difficulty={difficulty}
        >
          Nivel dificil
        </CustomButton>
      </Stack>

      <Board
        board={board}
        onCellClick={handleCellClick}
        gameOver={gameOver}
        victory={victory}
        handleCellRightClick={(event, rowIndex, colIndex) => {
          handleCellRightClick(event, rowIndex, colIndex);
        }}
        difficulty={difficulty}
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
                Has Ganado :D Superaste el nivel {difficulty}
              </Typography>
            </Box>
          </CustomBox>
        </Modal>
      )}
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

const CustomButton = styled(Button)(({ theme, difficulty }) => ({
  width: 150,
  fontWeight: 700,
  "&:nth-child(1)": {
    color: "#0046FF", // Primer botón
    background:
      "linear-gradient(to right, rgba(41,184,229,1) 0%, rgba(129,209,235,1) 50%, rgba(41,184,229,1) 100%)",
  },
  "&:nth-child(2)": {
    color: "#FF3A00", // Segundo botón
    background:
      "linear-gradient(to right, rgba(241,231,103,1) 0%, rgba(254,182,69,1) 100%)",
  },
  "&:nth-child(3)": {
    color: "#FFFFFF", // Tercer botón
    background:
      "linear-gradient(to right, rgba(240,39,39,1) 0%, rgba(240,39,39,1) 20%, rgba(237,21,118,1) 40%, rgba(237,21,118,1) 50%, rgba(237,21,118,1) 60%, rgba(240,39,39,1) 80%, rgba(240,39,39,1) 100%)",
  },
}));

const CustomReplayButton = styled(Button)(({ theme, difficulty }) => ({
  width: 150,
  color: "#000000",
  fontWeight: 700,
  background:
    "linear-gradient(to right, rgba(92,242,127,1) 0%, rgba(53,250,122,1) 100%)",
}));
