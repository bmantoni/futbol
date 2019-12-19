var MatterBodyWrapper = require('./MatterBodyWrapper');

class Ball extends MatterBodyWrapper {
    constructor(x, y, radius) {
        super(x, y, radius);
    }
}

module.exports = Ball;