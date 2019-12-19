var GameEngine = require('./GameEngine');

class GameState {
    static STATE_UPDATE_INTERVAL = 100;

    constructor() {
        this.players = 0
        this.engine = new GameEngine(GameState.STATE_UPDATE_INTERVAL);
    }
    join() {
        return num++;
    }
    reset() {
        this.players = 0;
        this.engine = new GameEngine(GameState.STATE_UPDATE_INTERVAL);
    }
    start() {
        setInterval(() => {
            this.engine.tick();
        }, GameState.STATE_UPDATE_INTERVAL);
    }
    getState() {
        // need player1, 2, and ball: position, vector
        //      score
    }
}

module.exports = GameState;