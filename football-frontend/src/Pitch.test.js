import React from 'react';
import ReactDOM from "react-dom";
import { render } from '@testing-library/react';
import Pitch from './Pitch';

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
})

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