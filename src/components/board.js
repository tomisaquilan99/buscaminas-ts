import React from "react";
import Cell from "./cell";

const Board = ({
  board,
  onCellClick,
  gameOver,
  victory,
  handleCellRightClick,
}) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: `repeat(${board[0].length}, 60px)`,
      columnGap: 3,
      pointerEvents: gameOver || victory ? "none" : "auto",
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
        />
      ))
    )}
  </div>
);

export default Board;
