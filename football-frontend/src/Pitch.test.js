import React from 'react';
import ReactDOM from "react-dom";
import { render } from '@testing-library/react';
import Pitch from './Pitch';
import Player from './Player';

import Matter from "matter-js";
import NetworkClient from './NetworkClient';
jest.mock('./NetworkClient');

test('scores initialise properly', () => {
    var p = new Pitch({});
    
    expect(p.state.player1Score).toBe(0);    
    expect(p.state.player2Score).toBe(0);
});

test('correct score gets incremented on scoring', () => {
    const domContainer = document.createElement('div');
    var p = ReactDOM.render(<Pitch />, domContainer);

    p.handlePlayerScored(1, p);

    expect(p.state.player1Score).toBe(1);
    expect(p.state.player2Score).toBe(0);
    p.handlePlayerScored(2, p);
    expect(p.state.player1Score).toBe(1);
    expect(p.state.player2Score).toBe(1);
});

test('movePlayer sends update if it should', () => {
    const domContainer = document.createElement('div');
    const player = 1;
    var p = ReactDOM.render(<Pitch player={player} />, domContainer);

    var mockSend = jest.fn((obj) => {});
    p.netClient.send = mockSend;
    
    p.movePlayer(p.player1, Player.Direction.UP, true);
    
    expect(mockSend.mock.calls.length).toBe(1);
    expect(mockSend.mock.calls[0][0].action).toBe('I'); // 'Input'
    expect(mockSend.mock.calls[0][0].player).toBe('1');
    expect(mockSend.mock.calls[0][0].direction).toBe('UP');
});

test('movePlayer doesnt send update if it shouldnt', () => {
    const domContainer = document.createElement('div');
    const player = 1;
    var p = ReactDOM.render(<Pitch player={player} />, domContainer);

    var mockSend = jest.fn((obj) => {});
    p.netClient.send = mockSend;
    
    p.movePlayer(p.player1, Player.Direction.UP, false);
    
    expect(mockSend.mock.calls.length).toBe(0);
});

test('currentPlayer returns player1 if it should', () => {
    const domContainer = document.createElement('div');
    const player = 1;
    var p = ReactDOM.render(<Pitch player={player} />, domContainer);
    var cp = p.currentPlayer();
    expect(cp).toBe(p.player1);
});

test('observingOnly works when true', () => {
    const domContainer = document.createElement('div');
    const player = 3;
    var p = ReactDOM.render(<Pitch player={player} />, domContainer);
    expect(p.observingOnly()).toBe(true);
});

test('observingOnly works when false', () => {
    const domContainer = document.createElement('div');
    const player = 1;
    var p = ReactDOM.render(<Pitch player={player} />, domContainer);
    expect(p.observingOnly()).toBe(false);
});

test('currentPlayer returns player2 if it should', () => {
    const domContainer = document.createElement('div');
    const player = 2;
    var p = ReactDOM.render(<Pitch player={player} />, domContainer);
    var cp = p.currentPlayer();
    expect(cp).toBe(p.player2);
});

test('handleKeyPress doesnt call move when observing', () => {
    const domContainer = document.createElement('div');
    const player = 3;
    var p = ReactDOM.render(<Pitch player={player} />, domContainer);

    const originalApplyForce = Matter.Body.applyForce;
    var mockApplyForce = jest.fn((b, p, v) => {});
    Matter.Body.applyForce = mockApplyForce;
    
    var cp = p.handleKeyPress('a');
    expect(mockApplyForce.mock.calls.length).toBe(0);
    Matter.Body.applyForce = originalApplyForce;
});

test('handleKeyPress calls move when not observing', () => {
    const domContainer = document.createElement('div');
    const player = 1;
    var p = ReactDOM.render(<Pitch player={player} />, domContainer);

    const originalApplyForce = Matter.Body.applyForce;
    var mockApplyForce = jest.fn((b, p, v) => {});
    Matter.Body.applyForce = mockApplyForce;
    
    var cp = p.handleKeyPress('a');
    expect(mockApplyForce.mock.calls.length).toBe(1);
    Matter.Body.applyForce = originalApplyForce;
});

test('movePlayer doesnt call send when sendUpdate false', () => {
    const domContainer = document.createElement('div');
    const player = 1;
    var p = ReactDOM.render(<Pitch player={player} />, domContainer);
    
    var cp = p.movePlayer(p.player1, Player.Direction.UP, false);
    expect(p.netClient.send.mock.calls.length).toBe(0);
    // NetworkClient is automocked
});

test('movePlayer does call send when sendUpdate not provided', () => {
    const domContainer = document.createElement('div');
    const player = 1;
    var p = ReactDOM.render(<Pitch player={player} />, domContainer);

    var cp = p.movePlayer(p.player1, Player.Direction.UP);
    expect(p.netClient.send.mock.calls.length).toBe(1);
});

test('state updates get applied correctly', () => {
    var testState = {
        player1: {
            position: {x: 42, y: 42},
            velocity: {x: 1, y: 3},
            score: 12
        },
        player2: {
            position: {x: 420, y: 420},
            velocity: {x: 10, y: 30},
            score: 34
        },
        ball: {
            position: {x: 420, y: 420},
            velocity: {x: 10, y: 30}
        }
    }

    const domContainer = document.createElement('div');
    var p = ReactDOM.render(<Pitch />, domContainer);

    p.updateStateHandler(testState, p);

    expect(p.state.player1Score).toBe(12);
    expect(p.player1.body.position.x).toBe(42);
    expect(p.player1.body.position.y).toBe(42);
    expect(p.player1.body.velocity.x).toBe(1);
    expect(p.player1.body.velocity.y).toBe(3);
    expect(p.player2.body.position.x).toBe(420);
    expect(p.player2.body.position.y).toBe(420);
    expect(p.player2.body.velocity.x).toBe(10);
    expect(p.player2.body.velocity.y).toBe(30);
    expect(p.state.player2Score).toBe(34);
    expect(p.ball.body.position.x).toBe(420);
    expect(p.ball.body.position.y).toBe(420);
    expect(p.ball.body.velocity.x).toBe(10);
    expect(p.ball.body.velocity.y).toBe(30);
})