var assert = require('assert');
const Broadcaster = require('../src/Broadcaster');

describe('Broadcaster', function() {
    it('sends to each client', function() {
        var out = []
        function createClient() { return {send: p => out.push(p)} };
        var mock = {
            getWss: () => {return {clients: [createClient(), createClient()]}}
        }
        var b = new Broadcaster(mock);
        b.broadcast({hello: 'world'});
        assert.equal(out.length, 2);
    });
})