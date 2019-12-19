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
    it('collision detection event works', function() {
        var ge = new GameEngine();
        var startingX = ge.player1.body.position.x;
        ge.movePlayer(ge.player2, 'UP');
        for (var i = 0; i < 7; ++i) {
            ge.movePlayer(ge.player1, 'RIGHT');
            ge.tick();
        }
        ge.tick();
        ge.tick();
        ge.tick();
        assert.equal(ge.player1Score, 1);
    });
})