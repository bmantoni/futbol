import React from "react";
import ReactDOM from "react-dom";
import Matter from "matter-js";
import KeyboardEventHandler from 'react-keyboard-event-handler';
import Player from './Player';
import Ball from './Ball';
import ScoreBoard from './ScoreBoard';
import NetworkClient from './NetworkClient';

class Scene extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.PITCH_WIDTH = 800;
    this.PITCH_HEIGHT = 550;

    this.netClient = new NetworkClient('localhost', '3001', this.updateStateHandler, this);

    this.myEngine = Matter.Engine.create({});
    this.myEngine.world.gravity.y = 0;

    this.player1 = new Player(200, this.PITCH_HEIGHT/2, 15);
    this.player1.body.frictionAir = 0.02;
    this.player2 = new Player(this.PITCH_WIDTH-200, this.PITCH_HEIGHT/2, 15);
    this.ball = new Ball(this.PITCH_WIDTH/2, this.PITCH_HEIGHT/2, 20);

    var goalPostRenderStyle = {fillStyle: '#e8db7b', strokeStyle: 'yellow', lineWidth: 0};
    this.player1goalPost = Matter.Bodies.rectangle(1, this.PITCH_HEIGHT/2, 51, 100, { isStatic: true, render: goalPostRenderStyle });
    this.player2goalPost = Matter.Bodies.rectangle(this.PITCH_WIDTH-1, this.PITCH_HEIGHT/2, 51, 100, { isStatic: true, render: goalPostRenderStyle });

    this.state = {player1Score: 0, player2Score: 0};
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

  handlePlayerScored(player, self) {
    self.setState({player1Score: self.state.player1Score + (player === 1 ? 1 : 0), 
      player2Score: self.state.player2Score + (player === 2 ? 1 : 0)});
    self.resetPositions(self);
  }

  resetPositions(self) {
    self.player1.resetPosition();
    self.player2.resetPosition();
    self.ball.resetPosition();
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

  componentDidMount() {
    var render = Matter.Render.create({
      element: this.refs.scene,
      engine: this.myEngine,
      options: {
        width: this.PITCH_WIDTH,
        height: this.PITCH_HEIGHT,
        wireframes: false
      }
    });

    Matter.World.add(this.myEngine.world, this.createPitch());
    Matter.World.add(this.myEngine.world, [this.player1.body, this.player2.body, this.ball.body]);
    this.watchForCollisions();

    Matter.Engine.run(this.myEngine);
    Matter.Render.run(render);
  }

  movePlayerHandler(playerNum, direction, self = this) {
    if (playerNum !== self.props.player) {
      var playerObj = playerNum === 1 ? self.player1 : self.player2;
      self.movePlayer(playerObj, direction, false);
    }
  }

  movePlayer(player, direction, sendUpdate = true) {
    var vector = player.calcRunVector(direction);
    Matter.Body.applyForce(player.body, {x: player.body.position.x, y: player.body.position.y }, vector);
    if (sendUpdate) {
      this.netClient.send({player: this.props.player.toString(), action: 'I', direction: direction});
    }
  }

  currentPlayer() {
    return this.props.player === 1 ? this.player1 : this.player2;
  }

  DIRECTION_MAP = {
    'w': Player.Direction.UP,
    'a': Player.Direction.LEFT,
    's': Player.Direction.DOWN,
    'd': Player.Direction.RIGHT
  }

  handleKeyPress(k) {
    this.movePlayer(this.currentPlayer(), this.DIRECTION_MAP[k]);
  }

  updateStateHandler(newState, self) {
    Matter.Body.setVelocity(self.player1.body, newState.player1.velocity);
    Matter.Body.setPosition(self.player1.body, newState.player1.position);
    Matter.Body.setAngle(self.player1.body, newState.player1.angle);
    Matter.Body.setVelocity(self.player2.body, newState.player2.velocity);
    Matter.Body.setPosition(self.player2.body, newState.player2.position);
    Matter.Body.setAngle(self.player2.body, newState.player2.angle);
    Matter.Body.setVelocity(self.ball.body, newState.ball.velocity);
    Matter.Body.setPosition(self.ball.body, newState.ball.position);
    Matter.Body.setAngle(self.ball.body, newState.ball.angle);
    // TODO scores too
  }

  render() {
    return <div className='outerContainer'>
        <ScoreBoard player1Score={this.state.player1Score} player2Score={this.state.player2Score} />
        <div className="scene" ref="scene" />
        <KeyboardEventHandler
          handleKeys={['w', 'a', 's', 'd']}
          onKeyEvent={(key, e) => this.handleKeyPress(key)} />
      </div>;
  }
}
export default Scene;