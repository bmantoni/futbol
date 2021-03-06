import React from "react";
import ReactDOM from "react-dom";
import Matter from "matter-js";
import KeyboardEventHandler from 'react-keyboard-event-handler';
import Player from './Player';
import Ball from './Ball';
import ScoreBoard from './ScoreBoard';
import NetworkClient from './NetworkClient';

class Pitch extends React.Component {
  
  PITCH_WIDTH = 800;
  PITCH_HEIGHT = 550;

  constructor(props) {
    super(props);

    this.netClient = new NetworkClient(
      process.env.REACT_APP_SERVER_HTTP,
      process.env.REACT_APP_SERVER_HOST,
      process.env.REACT_APP_SERVER_WS_PORT,
      process.env.REACT_APP_SERVER_PATH_PREFIX,
      this.updateStateHandler, 
      props.messageHandler,
      this);

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
    this.mRender = Matter.Render.create({
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

    //const canvas = document.querySelector('canvas')
    var self = this
    this.mRender.canvas.addEventListener('mousedown', function(e) {
        self.handleClick(self.mRender.canvas, e)
    })

    Matter.Engine.run(this.myEngine);
    Matter.Render.run(this.mRender);
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

  observingOnly() {
    return this.props.player > 2;
  }

  DIRECTION_MAP = {
    'w': Player.Direction.UP,
    'a': Player.Direction.LEFT,
    's': Player.Direction.DOWN,
    'd': Player.Direction.RIGHT
  }

  // INPUT HANDLING

  handleKeyPress(k) {
    if (!this.observingOnly()) {
      this.movePlayer(this.currentPlayer(), this.DIRECTION_MAP[k]);
    }
  }

  handleClick(canvas, event) {
    if (!this.observingOnly()) {
      this.moveBasedOnClick(canvas, event);
    }
  }

  moveBasedOnClick(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const MARGIN = 20
    if (x > this.currentPlayer().body.position.x + MARGIN) {
      this.movePlayer(this.currentPlayer(), Player.Direction.RIGHT);
    }
    if (x < this.currentPlayer().body.position.x - MARGIN) {
      this.movePlayer(this.currentPlayer(), Player.Direction.LEFT);
    }
    if (y > this.currentPlayer().body.position.y + MARGIN) {
      this.movePlayer(this.currentPlayer(), Player.Direction.DOWN);
    }
    if (y < this.currentPlayer().body.position.y - MARGIN) {
      this.movePlayer(this.currentPlayer(), Player.Direction.UP);
    }
  }

  //

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
    self.setState({player1Score: newState.player1.score, 
      player2Score: newState.player2.score});
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
export default Pitch;