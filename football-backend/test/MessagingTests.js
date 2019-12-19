var assert = require('assert');
const WebSocket = require('express-ws/node_modules/ws');

describe('Socket messages', function () {
    var server;
    var game;
    var ws;
    beforeEach(function () {
        var obj = require('../server');
        server = obj.server;
        game = obj.gameState;
        ws = new WebSocket('ws://localhost:3001/ws');
    });
    afterEach(function () {
        ws.close();
        server.close();
    });
    describe('state updates', function () {
        it('send valid starting state', async function () {
            const expected = `{"player1":{"position":{"x":200,"y":275},"velocity":{"x":0,"y":0},"angle":0},"player2":{"position":{"x":600,"y":275},"velocity":{"x":0,"y":0},"angle":0},"ball":{"position":{"x":600,"y":275},"velocity":{"x":0,"y":0},"angle":0}}`;
            var promise = new Promise((resolve, reject) => {
                ws.on('message', function incoming(data) {
                    //console.log('Server sent back: ' + data);
                    assert.equal(data, expected);
                    game.stop();
                    resolve();
                });
            });
            //setTimeout(() => ws.send(testMessage), 500);
            return promise;
        });
    });
});