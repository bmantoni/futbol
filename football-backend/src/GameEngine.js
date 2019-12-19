var Matter = require('matter-js');
var Player = require('./Player');
var Ball = require('./Ball');

class GameEngine {
    //static TICK_TIME_DELTA = 1000 / 60;
    player1Score = 0;
    player2Score = 0;

    constructor(updateDelta = 100) {
        this.PITCH_WIDTH = 800;
        this.PITCH_HEIGHT = 550;
        this.updateInterval = updateDelta;

        this.myEngine = Matter.Engine.create({});
        this.myEngine.world.gravity.y = 0;
        this.player1 = new Player(200, this.PITCH_HEIGHT/2, 15);
        this.player1.body.frictionAir = 0.02;
        this.player2 = new Player(this.PITCH_WIDTH-200, this.PITCH_HEIGHT/2, 15);
        this.ball = new Ball(this.PITCH_WIDTH/2, this.PITCH_HEIGHT/2, 20);
        var goalPostRenderStyle = {fillStyle: '#e8db7b', strokeStyle: 'yellow', lineWidth: 0};
        this.player1goalPost = Matter.Bodies.rectangle(1, this.PITCH_HEIGHT/2, 51, 100, { isStatic: true, render: goalPostRenderStyle });
        this.player2goalPost = Matter.Bodies.rectangle(this.PITCH_WIDTH-1, this.PITCH_HEIGHT/2, 51, 100, { isStatic: true, render: goalPostRenderStyle });

        Matter.World.add(this.myEngine.world, this.createPitch());
        Matter.World.add(this.myEngine.world, [this.player1.body, this.player2.body, this.ball.body]);
        this.watchForCollisions();

        // this ties into window requestAnimationFrame, so cant use it, need to tick ourselves
        // Matter.Engine.run(this.myEngine); 
    }

    tick() {
        Matter.Engine.update(this.myEngine, this.updateInterval);
    }

    movePlayer(player, direction) {
        var vector = player.calcRunVector(direction);
        Matter.Body.applyForce(player.body, {x: player.body.position.x, y: player.body.position.y }, vector);
    }

    watchForCollisions() {
        var self = this;
        Matter.Events.on(this.myEngine, 'collisionStart', function(event) {
            if (self.didPlayer2Score(event.pairs)) {
                self.handlePlayerScored(2, self);
            }
            if (self.didPlayer1Score(event.pairs)) {
                self.handlePlayerScored(1, self);
            }
        });
    }

    didPlayer2Score(pairs) {
        return pairs.find(p => (p.collision.bodyA.id === this.player1goalPost.id &&
        p.collision.bodyB.id === this.ball.body.id) || (
        p.collision.bodyB.id === this.player1goalPost.id &&
        p.collision.bodyA.id === this.ball.body.id));
    }

    didPlayer1Score(pairs) {
        return pairs.find(p => (p.collision.bodyA.id === this.player2goalPost.id &&
        p.collision.bodyB.id === this.ball.body.id) || (
        p.collision.bodyB.id === this.player2goalPost.id &&
        p.collision.bodyA.id === this.ball.body.id));
    }

    handlePlayerScored(player, self) {
        self.player1Score = self.player1Score + (player === 1 ? 1 : 0);
        self.player2Score = self.player2Score + (player === 2 ? 1 : 0);
        self.resetPositions(self);
    }

    resetPositions(self) {
        self.player1.resetPosition();
        self.player2.resetPosition();
        self.ball.resetPosition();
    }

    createPitch() {
        return [
        // walls
        Matter.Bodies.rectangle(this.PITCH_WIDTH/2, 0, this.PITCH_WIDTH, 50, { isStatic: true }),
        Matter.Bodies.rectangle(this.PITCH_WIDTH/2, this.PITCH_HEIGHT, this.PITCH_WIDTH, 50, { isStatic: true }),
        Matter.Bodies.rectangle(this.PITCH_WIDTH, this.PITCH_HEIGHT/2, 50, this.PITCH_HEIGHT, { isStatic: true }),
        Matter.Bodies.rectangle(0, this.PITCH_HEIGHT/2, 50, this.PITCH_HEIGHT, { isStatic: true }),
        // goalposts
        this.player1goalPost,
        this.player2goalPost,
        ];
    }
}

module.exports = GameEngine;