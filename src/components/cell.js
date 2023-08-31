import React from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/system";

const CustomButton = styled(Button)(({ theme, revealed, difficulty }) => ({
  "&:hover": {
    borderColor:
      difficulty === "PRINCIPIANTE"
        ? "#00BDFF"
        : difficulty === "INTERMEDIO"
        ? "orange"
        : difficulty === "DIFICIL"
        ? "red"
        : "inherit",
  },
  minWidth: 0,
  maxWidth: "40px",
  height: "40px",
  fontSize: "16px",
  fontWeight: 700,
  color:
    difficulty === "PRINCIPIANTE"
      ? "#0046FF"
      : difficulty === "INTERMEDIO"
      ? "#FF3A00"
      : difficulty === "DIFICIL"
      ? "#FFFFFF"
      : "inherit",
  padding: "0",
  background:
    revealed && difficulty === "PRINCIPIANTE"
      ? "linear-gradient(to right, rgba(41,184,229,1) 0%, rgba(129,209,235,1) 50%, rgba(41,184,229,1) 100%)"
      : revealed && difficulty === "INTERMEDIO"
      ? "linear-gradient(to right, rgba(241,231,103,1) 0%, rgba(254,182,69,1) 100%)"
      : revealed && difficulty === "DIFICIL"
      ? "linear-gradient(to right, rgba(240,39,39,1) 0%, rgba(240,39,39,1) 20%, rgba(237,21,118,1) 40%, rgba(237,21,118,1) 50%, rgba(237,21,118,1) 60%, rgba(240,39,39,1) 80%, rgba(240,39,39,1) 100%)"
      : "none",
  border:
    difficulty === "PRINCIPIANTE"
      ? "1px solid #00BDFF"
      : difficulty === "INTERMEDIO"
      ? "1px solid orange"
      : difficulty === "DIFICIL"
      ? "1px solid red"
      : "inherit",
}));

const Cell = ({
  value,
  onClick,
  revealed,
  handleCellRightClick,
  rowIndex,
  colIndex,
  board,
  difficulty,
}) => (
  <CustomButton
    type="button"
    onClick={onClick}
    tabIndex={-1}
    revealed={revealed}
    difficulty={difficulty}
    variant={revealed ? "contained" : "outlined"}
    onContextMenu={(event) => {
      event.preventDefault();
      handleCellRightClick(event, rowIndex, colIndex);
    }}
    onMouseDown={(event) => {
      // event.preventDefault();
    }}
  >
    {revealed
      ? value === "bomb"
        ? "💣"
        : value
      : board[rowIndex][colIndex].flagged
      ? "🚩"
      : null}
  </CustomButton>
);

export default Cell;
