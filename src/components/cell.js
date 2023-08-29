import React from "react";
import { Button } from "@mui/material";

const Cell = ({ value, onClick, revealed }) => (
  <Button
    onClick={onClick}
    style={{
      width: "30px",
      height: "30px",
      fontSize: "16px",
      padding: "0", // Añadimos esto para eliminar el relleno interno del botón
    }}
    variant={revealed ? "contained" : "outlined"}
  >
    {revealed ? (value === "bomb" ? "💣" : value) : null}
  </Button>
);

export default Cell;
