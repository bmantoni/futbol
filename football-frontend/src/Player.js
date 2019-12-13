import MatterBodyWrapper from './MatterBodyWrapper';

class Player extends MatterBodyWrapper {
    static Direction = {UP: 'UP', DOWN: 'DOWN', LEFT: 'LEFT', RIGHT: 'RIGHT'}

    constructor(x, y, radius) {
        super(x, y, radius);
        this.RUN_FORCE = 0.004;

        this.calcRunVector = (direction) => {
            return {
                x: direction == Player.Direction.LEFT ? (-1) * this.RUN_FORCE : (direction == Player.Direction.RIGHT ? this.RUN_FORCE : 0),
                y: direction == Player.Direction.UP ? (-1) * this.RUN_FORCE : (direction == Player.Direction.DOWN ? this.RUN_FORCE : 0),
              };
        };
    }
}

export default Player;