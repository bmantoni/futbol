[![Actions Status](https://github.com/bmantoni/futbol/workflows/Build%20FrontEnd/badge.svg)](https://github.com/bmantoni/futbol/actions)
[![Actions Status](https://github.com/bmantoni/futbol/workflows/Build%20BackEnd/badge.svg)](https://github.com/bmantoni/futbol/actions)
[![Coverage Status](https://coveralls.io/repos/github/bmantoni/futbol/badge.svg?branch=master)](https://coveralls.io/github/bmantoni/futbol?branch=master)

# futbol
Simple football-like multiplayer game to explore basic multiplayer state synchronisation.

## Dev Notes
On the journey to get this working, I went through a couple milestones:

### Step 1 - Local Game

Players and Ball, keyboard input, physics for kicking, collision detection, scoring.

### Step 2 - Naive Multiplayer

Added an Express + Websocket backend that simply echoes/broadcasts moves back to all players.

A POST is done first to join the game and get the player number.

Moves are then sent to the WebSocket and are echoed back.

Each player is running the game engine, and the server merely echoes players' moves to all other players, where the moves are applied to the current state.

This achieves basic synchronising of game state, for a little while. But things quickly get out of sync because the state that each input is applied to on the remote end diverges more and more from the state on the origin side.

### Step 3 - Server-Side Game Execution and State Reconciliation

1. The server will also run its own version of the physics engine and run inputs on it just like the clients do. 
2. Each client sends all moves to the server, continuing to process local moves immediately.
3. But now each client regularly receives messages that take the form of State updates, rather than individual remote moves. The server-provided state updates take precedence. This is roughly a prediction-based approach, see [here](https://developer.valvesoftware.com/wiki/Source_Multiplayer_Networking), and [here](https://medium.com/@qingweilim/how-do-multiplayer-games-sync-their-state-part-1-ab72d6a54043).
4. The server receives moves from each client and applies them locally.
5. The server runs two related loops - 1 to update the physics engine (rather rapidly), and one to broadcast the current game state (more slowly).

### Step 4 - Refinements

1. Mouse/touch support 
2. Status bar with message output
3. Latency calculation
4. Observer mode (players > 2)

## Deployment
GitHub actions used to deploy the front-end to S3 and backend to ECS. CloudFront used to serve everything - static S3 content and API requests to container (wss WebSocket and HTTPS POSTs.)
