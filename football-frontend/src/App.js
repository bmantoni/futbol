import React, { useState, useEffect } from "react";
import axios from 'axios';
import './App.css';
import Pitch from './Pitch'
import StatusBar from './StatusBar'
import NetworkClient from './NetworkClient'

const App = () => {
  const [hasError, setErrors] = useState(false);
  const [player, setPlayer] = useState({});
  const [message, setMessage] = useState('');

  async function joinGame() {
    try {
      var startTime = new Date();
      const res = await axios.post(NetworkClient.getApiUrl('join'));
      var endTime = new Date();
      setPlayer(res.data.player);
      setMessage(`Latency: ${endTime.getTime()-startTime.getTime()} ms`);
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    joinGame();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {player > 2 ? 'The game is full. Observing' : `Player ${JSON.stringify(player)}`}
      </header>
      <div>
        <Pitch player={player} messageHandler={setMessage} /> 
        <StatusBar resetCallback={joinGame} message={message} />
      </div>
    </div>
  );
}

export default App;
