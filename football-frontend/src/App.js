import React from 'react';
import logo from './logo.svg';
import './App.css';
import Pitch from './Pitch'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Player 1
      </header>
      <body>
        <Pitch player="1" /> 
      </body>
    </div>
  );
}

export default App;
