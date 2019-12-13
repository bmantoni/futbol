import Matter from "matter-js";

class MatterBodyWrapper {
    constructor(x, y, radius) {
        this.body = Matter.Bodies.circle(x, y, radius, { restitution: 0.2 });
        this.startingPosition = {x: x, y: y};

        this.resetPosition = () => {
            Matter.Body.setPosition(this.body, this.startingPosition);
        }
    }
}

export default MatterBodyWrapper;