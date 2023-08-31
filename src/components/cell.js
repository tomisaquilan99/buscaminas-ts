import React from "react";
import { Button } from "@mui/material";

const Cell = ({
  value,
  onClick,
  revealed,
  handleCellRightClick,
  rowIndex,
  colIndex,
  board,
}) => (
  <Button
    type="button"
    onClick={onClick}
    tabIndex={-1}
    style={{
      minWidth: 0,
      maxWidth: "40px",
      height: "40px",
      fontSize: "16px",
      padding: "0", // Añadimos esto para eliminar el relleno interno del botón
    }}
    variant={revealed ? "contained" : "outlined"}
    onContextMenu={(event) => {
      event.preventDefault();
      handleCellRightClick(event, rowIndex, colIndex);
    }}
    onMouseDown={(event) => {
      //event.preventDefault(); // Evitar el comportamiento predeterminado
    }}
  >
    {revealed
      ? value === "bomb"
        ? "💣"
        : value
      : board[rowIndex][colIndex].flagged // Mostrar la bandera si está marcada
      ? "🚩"
      : null}
  </Button>
);

export default Cell;
