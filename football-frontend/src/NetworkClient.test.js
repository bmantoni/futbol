import NetworkClient from "./NetworkClient";

it("sets WS URL correctly when prefix", () => {
    var nc = new NetworkClient('https', 'localhost', '8443', 'api/', null, null, this);
    expect(nc.ws.url).toBe('wss://localhost:8443/api/ws');
});

it("sets WS URL correctly when no prefix", () => {
    var nc = new NetworkClient('https', 'localhost', '8443', '', null, null, this);
    expect(nc.ws.url).toBe('wss://localhost:8443/ws');
});

it("sets WS URL correctly when http", () => {
    var nc = new NetworkClient('http', 'localhost', '8443', '', null, null, this);
    expect(nc.ws.url).toBe('ws://localhost:8443/ws');
});

it("calls messageSubscriber when handling message", () => {
    const msgCallback = jest.fn();
    var nc = new NetworkClient('http', 'localhost', '8443', '', null, msgCallback, this);
    const testMsg = JSON.stringify({action: 'text', message: 'hello'});
    const testEvent = {data: testMsg};

    nc.ws.onmessage(testEvent);
    
    expect(msgCallback).toHaveBeenCalledTimes(1);
    expect(msgCallback.mock.calls[0][0]).toEqual('hello');
});

it("calls stateSubscriber when handling state update", () => {
    const stateCallback = jest.fn();
    var nc = new NetworkClient('http', 'localhost', '8443', '', stateCallback, null, this);
    const testMsg = JSON.stringify({player1: {}, player2: {}});
    const testEvent = {data: testMsg};

    nc.ws.onmessage(testEvent);
    
    expect(stateCallback).toHaveBeenCalledTimes(1);
});