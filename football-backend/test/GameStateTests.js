var assert = require('assert');
var GameState = require('../src/GameState');

describe('game state', function() {
    it('initialises OK with no callback', function() {
        var gs = new GameState();
    });
    it('invokes callback after start', async function() {
        var promise = new Promise((resolve, reject) => {
            var gs = new GameState(() => {
                gs.stop();
                resolve();
            });
            gs.start();
        });
        return promise;
    });
    it('getState has correct values', function() {
        var gs = new GameState();
        gs.engine.handlePlayerScored(1, gs.engine);
        var s = gs.getState();
        assert.equal(s.player1.position, gs.engine.player1.body.position);
        assert.equal(s.player1.velocity, gs.engine.player1.body.velocity);
        assert.equal(s.player1.angle, gs.engine.player1.body.angle);
        assert.equal(s.player1.score, gs.engine.player1Score);
        assert.equal(gs.engine.player1Score, 1);
        assert.equal(s.player2.position, gs.engine.player2.body.position);
        assert.equal(s.player2.velocity, gs.engine.player2.body.velocity);
        assert.equal(s.player2.angle, gs.engine.player2.body.angle);
        assert.equal(s.player2.score, gs.engine.player2Score);
        assert.equal(gs.engine.player2Score, 0);
        assert.equal(s.ball.position, gs.engine.ball.body.position);
        assert.equal(s.ball.velocity, gs.engine.ball.body.velocity);
        assert.equal(s.ball.angle, gs.engine.ball.body.angle);
    });
    
    it('getState has correct values when used in state update callback', async function() {
        var promise = new Promise((resolve, reject) => {
            var gs = new GameState((s) => {
                assert.equal(s.player1.score, gs.engine.player1Score);
                assert.equal(gs.engine.player1Score, 1);
                assert.equal(s.player2.score, gs.engine.player2Score);
                assert.equal(gs.engine.player2Score, 0);
                gs.stop();
                resolve();
            });
            gs.engine.handlePlayerScored(1, gs.engine);
            gs.start();
        });
        return promise;
    });
    
})