import MatterBodyWrapper from './MatterBodyWrapper';

class Ball extends MatterBodyWrapper {
    constructor(x, y, radius) {
        super(x, y, radius);
    }
}

export default Ball;