var assert = require('assert');
var GameEngine = require('../src/GameEngine');

describe('game engine', function() {
    it('initialises OK', function() {
        var ge = new GameEngine();
    });
    it('handles player moves OK', function() {
        var ge = new GameEngine();
        var startingX = ge.player1.body.position.x;
        ge.movePlayer(ge.player1, 'LEFT');
        ge.tick();
        var currX = ge.player1.body.position.x;
        assert(currX < startingX);
    });
})