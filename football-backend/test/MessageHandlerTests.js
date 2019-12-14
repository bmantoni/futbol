var assert = require('assert');
var MessageHandler = require('../src/MessageHandler');

describe('MessageHandler', function () {
    describe('parsing', function () {
        it('returns object when valid join', function () {
            var test = '{"action": "JOIN"}';
            assert.equal(new MessageHandler().parse(test).action, 'JOIN');
        });
        it('throws error when invalid json', function () {
            var test = 'IM NOT JSON';
            assert.throws((test) => new MessageHandler().parse(test), Error);
        });
        it('throws error if no Action provided', function () {
            var test = '{"player1position": "x,y"}';
            assert.throws((test) => new MessageHandler().parse(test), Error);
        });
    });
});