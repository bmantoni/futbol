import MatterBodyWrapper from './MatterBodyWrapper';

class Player extends MatterBodyWrapper {
    static Direction = {UP: 'UP', DOWN: 'DOWN', LEFT: 'LEFT', RIGHT: 'RIGHT'}
    static RUN_FORCE = 0.004;

    constructor(x, y, radius) {
        super(x, y, radius);
    }

    calcRunVector(direction) {
        return {
            x: direction === Player.Direction.LEFT ? (-1) * Player.RUN_FORCE : (direction === Player.Direction.RIGHT ? Player.RUN_FORCE : 0),
            y: direction === Player.Direction.UP ? (-1) * Player.RUN_FORCE : (direction === Player.Direction.DOWN ? Player.RUN_FORCE : 0),
        }
    }
}

export default Player;