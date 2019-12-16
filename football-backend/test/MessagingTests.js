var assert = require('assert');
const WebSocket = require('express-ws/node_modules/ws');

describe('Socket messages', function () {
    var server;
    var ws;
    beforeEach(function () {
        server = require('../server');
        ws = new WebSocket('ws://localhost:3001/ws');
    });
    afterEach(function () {
        ws.close();
        server.close();
    });
    describe('when sent', function () {
        it('by 1 client is echoed back', async function () {
            const testMessage = '{"player": "1", "action": "P1U", "direction": "UP"}';
            var promise = new Promise((resolve, reject) => {
                ws.on('message', function incoming(data) {
                    console.log('Server sent back: ' + data);
                    assert.equal(data, testMessage);
                    resolve();
                    //return;
                });
            });
            setTimeout(() => ws.send(testMessage), 500);
            return promise;
        });
    });
});