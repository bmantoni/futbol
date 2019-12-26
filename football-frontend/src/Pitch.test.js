import React from 'react';
import ReactDOM from "react-dom";
import { render } from '@testing-library/react';
import Pitch from './Pitch';

test('state updates get applied', () => {
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
    var p = new Pitch({});
    //const { getByText } = render(<Pitch />);
    //HTMLCanvasElement.prototype.getContext = jest.fn(() => {});
    //const domContainer = document.createElement('div');
    //var p = ReactDOM.render(<Pitch />, domContainer);
    var state = {};
    var mockSetState = jest.fn(() => {});
    p.setState = mockSetState;
    p.updateStateHandler(testState, p);
    expect(mockSetState.mock.calls.length).toBe(1);
    expect(mockSetState.mock.calls[0][0]['player1Score']).toBe(12);
    expect(p.player1.body.position.x).toBe(42);
    expect(p.player1.body.position.y).toBe(42);
    expect(p.player1.body.velocity.x).toBe(1);
    expect(p.player1.body.velocity.y).toBe(3);
    expect(p.player2.body.position.x).toBe(420);
    expect(p.player2.body.position.y).toBe(420);
    expect(p.player2.body.velocity.x).toBe(10);
    expect(p.player2.body.velocity.y).toBe(30);
    expect(mockSetState.mock.calls[0][0]['player2Score']).toBe(34);
    expect(p.ball.body.position.x).toBe(420);
    expect(p.ball.body.position.y).toBe(420);
    expect(p.ball.body.velocity.x).toBe(10);
    expect(p.ball.body.velocity.y).toBe(30);
})