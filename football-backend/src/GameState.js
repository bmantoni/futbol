var GameEngine = require('./GameEngine');

class GameState {
    static STATE_UPDATE_INTERVAL = 100;

    constructor(stateUpdatedCallback) {
        this.players = 0
        this.stateUpdatedHandler = stateUpdatedCallback;
        this.engine = new GameEngine(GameState.STATE_UPDATE_INTERVAL);
    }
    start() {
        this.timerId = setInterval(() => {
            this.engine.tick();
            this.stateUpdatedHandler(this.getState());
        }, GameState.STATE_UPDATE_INTERVAL);
    }
    stop() {
        clearInterval(this.timerId);
    }
    join() {
        return num++;
    }
    reset() {
        this.players = 0;
        this.engine = new GameEngine(GameState.STATE_UPDATE_INTERVAL);
    }
    processInput(cmd) {
        ge.movePlayer(cmd.isPlayer1() ? ge.player1 : ge.player2, cmd.direction);
    }
    getState() {
        return {
            player1: {
                position: this.engine.player1.body.position,
                velocity: this.engine.player1.body.velocity,
                angle: this.engine.player1.body.angle,
                score: this.engine.player1score
            },
            player2: {
                position: this.engine.player2.body.position,
                velocity: this.engine.player2.body.velocity,
                angle: this.engine.player2.body.angle,
                score: this.engine.player2score
            },
            ball: {
                position: this.engine.player2.body.position,
                velocity: this.engine.player2.body.velocity,
                angle: this.engine.player2.body.angle
            }
        }
    }
}

module.exports = GameState;