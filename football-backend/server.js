const ws = require('express-ws')
const express = require('express')
const MessageHandler = require('./src/MessageHandler');
const GameState = require('./src/GameState');

const mh = new MessageHandler();
const gs = new GameState();

const server = express();
const wsInstance = ws(server);

server.get('/join', (req, res) => {
	console.log((new Date()) + ' Received request for ' + req.url);
	res.json({player: gs.join()});
})
.get('/reset', (req, res) => {
	gs.reset();
	res.json({result: 'OK'});
});

server.ws('/ws', (ws, req) => {
	ws.on('message', msg => {
		console.log('received: %s', msg);

		try {
			var cmd = mh.parse(msg); // just using to validate for now
			console.log(`echoing back to ${wsInstance.getWss().clients.size} clients`);
			wsInstance.getWss().clients.forEach(x => x.send(msg));
		} catch (err) {
			ws.send(JSON.stringify(err));
			console.log('ERROR ' + err);
		}
	});
});

var myServer = server.listen(3001);

module.exports = myServer;