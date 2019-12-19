const ws = require('express-ws')
const express = require('express')
const MessageHandler = require('./src/MessageHandler');
const GameState = require('./src/GameState');

const server = express();
const wsInstance = ws(server);

const mh = new MessageHandler();
const gs = new GameState((state) => {
	//console.log(JSON.stringify(state));
	console.log(`sending state update to ${wsInstance.getWss().clients.size} clients`);
	wsInstance.getWss().clients.forEach(x => x.send(JSON.stringify(state)));
}).start();

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
			var cmd = mh.parse(msg);
			gs.processInput(cmd);
		} catch (err) {
			ws.send(JSON.stringify(err));
			console.log('ERROR ' + err);
		}
	});
});

var myServer = server.listen(3001);

module.exports = myServer;