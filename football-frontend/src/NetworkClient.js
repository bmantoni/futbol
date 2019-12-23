var ws = require('ws');

class NetworkClient {
    constructor(protocol, server, port, prefix, stateSubscriber, that) {
        this.stateUpdateSubscriber = stateSubscriber;
        this.subscriberOwner = that;
        this.ws = new WebSocket(`ws${protocol==='https'?'s':''}://${server}:${port}/ws`);
        var myself = this;
        
        this.ws.onopen = function() {
            // do something
            console.log('opened socket');
        };
        this.ws.onerror = function() {
            // do something
            console.log('socket open error');
        };
        this.ws.onclose = function() {
            // do something
            console.log('socket closed');
        };
        this.ws.onmessage = function(msgevent) {
            console.log('client received: ' + msgevent.data);
            var newState = JSON.parse(msgevent.data);
            if (!newState.player1 || !newState.player2) {
                console.log('not a player move update message.');
                return;
            }
            if (myself.stateUpdateSubscriber) {
                console.log('invoke callback');
                myself.stateUpdateSubscriber(newState, myself.subscriberOwner);
            }
        };
    }

    send(msg)  {
        this.ws.send(window.JSON.stringify(msg));
    }
}

export default NetworkClient;