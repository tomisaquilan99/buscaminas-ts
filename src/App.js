import React from "react";
import { Container, CssBaseline } from "@mui/material";
import Game from "./components/game";

function App() {
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Game />
    </Container>
  );
}

export default App;
