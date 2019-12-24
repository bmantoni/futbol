import React, { useState, useEffect } from "react";
import './App.css';
import Pitch from './Pitch'
import StatusBar from './StatusBar'
import NetworkClient from './NetworkClient'

const App = () => {
  const [hasError, setErrors] = useState(false);
  const [player, setPlayer] = useState({});
  const [message, setMessage] = useState('');

  async function joinGame() {
    const res = await fetch(NetworkClient.getApiUrl('join'));
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
        {player > 2 ? 'The game is full. Observing' : `Player ${JSON.stringify(player)}`}
      </header>
      <body>
        <Pitch player={player} messageHandler={setMessage} /> 
        <StatusBar resetCallback={joinGame} message={message} />
      </body>
    </div>
  );
}

export default App;
