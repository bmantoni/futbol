# futbol
Simple football-like multiplayer game to explore basic state synchronisation.

## Dev Notes

### Step 1 - Local Game

Players and Ball, keyboard input, physics for kicking, collision detection, scoring.

### Step 2 - Naive Multiplayer

Added an Express + Websocket backend that simply echoes/broadcasts moves back to all players.

A POST is done first to join the game and get the player number.

Moves are then sent to the WebSocket and are echoed back.

This achieves basic synchronising of game state, for a little while. But things quickly get out of sync because the state each input is applied to on the remote end diverges more and more from the state on the origin side.

### Step 3 - Server-Side Game Execution and State Reconciliation

1. The server will run its own version of the physics engine and run inputs on it just like the clients do. 
2. Each client sends all moves to the server, continuing to process local moves immediately.
3. Each client will now receive messages on the socket that take the form of State updates, rather than individual remote moves. The server-provided state updates take precedence.
4. The server receives moves from each client and applies them locally.
5. The server runs two related loops - 1 to update the physics engine, and one to broadcast the current game state.

## TODO

1. Dockerfile for backend *Done*
2. Create ECS service, cluster, LB, bucket, and IAM Role for Github Actions to use. *Done*
3. Setup GitHub Run Action to deploy *Done*
4. Dynamically update LB URL in front-end build env var and AWS secrets.
