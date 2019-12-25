var ws = require('ws');

class NetworkClient {

    static getApiUrl = (method) => {
        return `${process.env.REACT_APP_SERVER_HTTP}://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_HTTP_PORT}/${process.env.REACT_APP_SERVER_PATH_PREFIX}${method}`;
    }

    constructor(protocol, server, port, prefix, stateSubscriber, msgSubscriber, that) {
        this.stateUpdateSubscriber = stateSubscriber;
        this.messageSubscriber = msgSubscriber;
        this.subscriberOwner = that;
        this.ws = new WebSocket(`ws${protocol==='https'?'s':''}://${server}:${port}/${prefix}ws`);
        var myself = this;
        
        this.ws.onopen = function() {
            console.log('opened socket');
        };
        this.ws.onerror = function() {
            console.log('socket open error');
        };
        this.ws.onclose = function() {
            console.log('socket closed');
        };
        this.ws.onmessage = function(msgevent) {
            console.log('client received: ' + msgevent.data);
            var msgObj = JSON.parse(msgevent.data);
            if (msgObj.action === 'text') {
                console.log('message received. invoking callback');
                if (myself.messageSubscriber) {
                    myself.messageSubscriber(msgObj.message);
                }
                return;
            }
            if (!msgObj.player1 || !msgObj.player2) {
                console.log('not a message or state update. ignoring.');
                return;
            }
            if (myself.stateUpdateSubscriber) {
                console.log('state update received. invoking callback');
                myself.stateUpdateSubscriber(msgObj, myself.subscriberOwner);
            }
        };
    }

    send(msg)  {
        this.ws.send(window.JSON.stringify(msg));
    }
}

export default NetworkClient;