import React, { useState, useEffect } from "react";
import './App.css';
import Pitch from './Pitch'

const App = () => {
  const [hasError, setErrors] = useState(false);
  const [player, setPlayer] = useState({});

  async function joinGame() {
    const res = await fetch("http://localhost:3000/join");
    res.json()
      .then(res => setPlayer(res.player))
      .catch(err => setErrors(err))
  }

  useEffect(() => {
    joinGame();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        Player {JSON.stringify(player)}
      </header>
      <body>
        <Pitch player={player} /> 
      </body>
    </div>
  );
}

export default App;
