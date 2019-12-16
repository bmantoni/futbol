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
		console.log('clients: ' + wsInstance.getWss().clients);

		try {
			var cmd = mh.parse(msg); // just using to validate for now
			wsInstance.getWss().clients.forEach(x => ws.send(msg));
		} catch (err) {
			ws.send(JSON.stringify(err));
			console.log('ERROR ' + err);
		}
	});
});

var myServer = server.listen(3001);

module.exports = myServer;