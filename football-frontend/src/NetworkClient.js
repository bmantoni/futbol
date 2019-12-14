var ws = require('ws');

class NetworkClient {
    constructor(domain, port) {
        this.ws = new WebSocket(`ws://${domain}:${port}/ws`);
        ws.onopen = function() {
            // do something
            console.log('opened socket');
        };
        ws.onerror = function() {
            // do something
            console.log('socket open error');
        };
        ws.onclose = function() {
            // do something
            console.log('socket closed');
        };
        ws.onmessage = function(msgevent) {
            var msg = JSON.parse(msgevent.data);
            // handle incoming message
            console.log(msg);
        };
        this.send = (msg) => {
            this.ws.send(window.JSON.stringify(msg));
        }
    }
}

export default NetworkClient;