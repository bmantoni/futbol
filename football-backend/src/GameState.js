var GameEngine = require('./GameEngine');

class GameState {
    // the state broadcast frequency
    static CLIENT_UPDATE_INTERVAL = 200;
    // the frequency the engine is ticked
    static STATE_UPDATE_INTERVAL = 16;
    // the time delta each tick advances the simulation
    static ENGINE_UPDATE_INTERVAL = 16;

    constructor(stateUpdatedCallback) {
        this.players = 0
        this.stateUpdatedHandler = stateUpdatedCallback;
        this.engine = new GameEngine(GameState.ENGINE_UPDATE_INTERVAL);
    }
    start() {
        this.timerIds = [
            setInterval(() => {
                this.engine.tick();
            }, GameState.STATE_UPDATE_INTERVAL),
            setInterval(() => {
                this.stateUpdatedHandler(this.getState());
            }, GameState.CLIENT_UPDATE_INTERVAL) 
        ];
    }
    stop() {
        this.timerIds.forEach(id => clearInterval(id));
    }
    join() {
        return ++this.players;
    }
    reset() {
        this.players = 0;
        this.engine = new GameEngine(GameState.ENGINE_UPDATE_INTERVAL);
    }
    processInput(cmd) {
        this.engine.movePlayer(cmd.isPlayer1() ? this.engine.player1 : this.engine.player2, cmd.direction);
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
                position: this.engine.ball.body.position,
                velocity: this.engine.ball.body.velocity,
                angle: this.engine.ball.body.angle
            }
        }
    }
}

module.exports = GameState;