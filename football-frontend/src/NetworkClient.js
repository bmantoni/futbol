var ws = require('ws');

class NetworkClient {
    constructor(domain, port, moveSubscriber, that) {
        this.moveUpdateSubscriber = moveSubscriber;
        this.subscriberOwner = that;
        this.ws = new WebSocket(`ws://${domain}:${port}/ws`);
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
            /*
            var msg = JSON.parse(msgevent.data);
            if (!msg.player || !msg.action || !['P1U', 'P2U'].includes(msg.action)) {
                console.log('not a player move update message. only handling those for now.');
                return;
            }
            console.log(myself.moveUpdateSubscriber);
            if (myself.moveUpdateSubscriber) {
                console.log('invoke callback');
                myself.moveUpdateSubscriber(parseInt(msg.player, 10), msg.direction, myself.subscriberOwner);
            }
            */
        };
    }

    send(msg)  {
        this.ws.send(window.JSON.stringify(msg));
    }
}

export default NetworkClient;