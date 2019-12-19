var assert = require('assert');
var MessageHandler = require('../src/MessageHandler');

describe('MessageHandler', function () {
    describe('parsing basics', function () {
        it('throws error when invalid json', function () {
            var test = 'IM NOT JSON';
            assert.throws(() => new MessageHandler().parse(test), 
                {name: 'SyntaxError', message: /Unexpected token/});
        });
        it('throws error if no Player provided', function () {
            var test = '{"action": "P1U", "direction": "UP"}';
            assert.throws(() => new MessageHandler().parse(test), 
                {name: 'Error', message: /Missing player/});
        });
        it('throws error if invalid Player provided', function () {
            var test = '{"player": "FOO", "action": "P1U", "direction": "UP"}';
            assert.throws(() => new MessageHandler().parse(test), 
                {name: 'Error', message: /Invalid player/});
        });
        it('throws error if no Action provided', function () {
            var test = '{"player": "1", "player1position": "x,y"}';
            assert.throws(() => new MessageHandler().parse(test), 
                {name: 'Error', message: /Missing action/});
        });
        it('throws error if invalid Action provided', function () {
            var test = '{"player": "1", "action": "FOO"}';
            assert.throws(() => new MessageHandler().parse(test), 
                {name: 'Error', message: /Invalid action/});
        });
    });
    describe('player move updates', function() {
        it('valid player1update OK', function () {
            var test = '{"player": "1", "action": "P1U", "direction": "UP"}';
            assert.equal(new MessageHandler().parse(test).direction, 'UP');
        });
        it('valid player2update OK', function () {
            var test = '{"player": "1", "action": "P2U", "direction": "UP"}';
            assert.equal(new MessageHandler().parse(test).direction, 'UP');
        });
        it('direction helper method works', function () {
            var test = '{"player": "1", "action": "P1U", "direction": "UP"}';
            assert.equal(new MessageHandler().parse(test).isUp(), true);
        });
        it('invalid direction throws error', function () {
            var test = '{"player": "1", "action": "P1U", "direction": "QUIETER"}';
            assert.throws(() => new MessageHandler().parse(test), 
                {name: 'Error', message: /Invalid direction/});
        });
    });
});