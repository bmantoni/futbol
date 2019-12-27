import React from 'react';
import ReactDOM from "react-dom";
import { render } from '@testing-library/react';
import Player from './Player';

test('Player inits body correctly', () => {
    var p = new Player(1, 2, 3);
    expect(p.body.position.x).toBe(1);
    expect(p.body.position.y).toBe(2);
});

test('Player calcs runVector UP correctly', () => {
    var p = new Player(1, 2, 3);
    var rv = p.calcRunVector(Player.Direction.UP);
    expect(rv).toStrictEqual({x: 0, y: (-1) * Player.RUN_FORCE});
});

test('Player calcs runVector DOWN correctly', () => {
    var p = new Player(1, 2, 3);
    var rv = p.calcRunVector(Player.Direction.DOWN);
    expect(rv).toStrictEqual({x: 0, y: Player.RUN_FORCE});
});

test('Player calcs runVector LEFT correctly', () => {
    var p = new Player(1, 2, 3);
    var rv = p.calcRunVector(Player.Direction.LEFT);
    expect(rv).toStrictEqual({x: (-1) * Player.RUN_FORCE, y: 0});
});

test('Player calcs runVector DOWN correctly', () => {
    var p = new Player(1, 2, 3);
    var rv = p.calcRunVector(Player.Direction.RIGHT);
    expect(rv).toStrictEqual({x: Player.RUN_FORCE, y: 0});
});