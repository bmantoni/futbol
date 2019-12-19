# futbol

# Devlopment Notes

## Step 1 - Local Game

Players and Ball, keyboard input, physics for kicking, collision detection, scoring.

## Step 2 - Naive Multiplayer

Added an Express + Websocket backend that simply echoes/broadcasts moves back to all players.

A POST is done first to join the game and get the player number.

Moves are then sent to the WebSocket and are echoed back.

This works sychronising the games state, for a little while. But things quickly get out of sync.

## Step 3 - Server-Side Game Execution and State Reconciliation

1. The server will run its own version of the physics engine and run inputs on it just like the clients do. 
2. Each client will now buffer local inputs, and run a loop to send them in batches.
3. Each client will now receive socket messages that take the form of State updates, rather than individual remote moves.
4. The server will run a loop to broadcast the current game state