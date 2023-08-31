import React from "react";
import Cell from "./cell";

const Board = ({
  board,
  onCellClick,
  gameOver,
  victory,
  handleCellRightClick,
  difficulty,
}) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: `repeat(${board[0].length}, 40px)`,
      columnGap: 0,
      pointerEvents: gameOver || victory ? "none" : "auto",
      marginBottom: 50,
    }}
  >
    {board.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <Cell
          key={`${rowIndex}-${colIndex}`}
          value={cell.value}
          onClick={() => onCellClick(rowIndex, colIndex)}
          revealed={cell.revealed}
          handleCellRightClick={handleCellRightClick}
          board={board}
          rowIndex={rowIndex}
          colIndex={colIndex}
          difficulty={difficulty}
        />
      ))
    )}
  </div>
);

export default Board;
