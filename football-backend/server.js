const ws = require('express-ws');
const express = require('express');
var bodyParser = require("body-parser");
const MessageHandler = require('./src/MessageHandler');
const GameState = require('./src/GameState');
const Broadcaster = require('./src/Broadcaster');

const server = express();
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

const wsInstance = ws(server);
const broadcaster = new Broadcaster(wsInstance);

const mh = new MessageHandler();
const gs = new GameState((state) => {
	//console.log(JSON.stringify(state));
	//console.log(`sending state update to ${wsInstance.getWss().clients.size} clients`);
	broadcaster.broadcast(state);
});
gs.start();

server.get('/', (req, res) => {
	res.json({status: 'OK'});
})
server.post('/api/join', (req, res) => {
	console.log((new Date()) + ' Received request for ' + req.url);
	const playerNum = gs.join();
	broadcaster.broadcast(
		MessageHandler.createTextMessage(`Player ${playerNum} has joined the game`));
	res.json({player: playerNum});
})
.post('/api/reset', (req, res) => {
	console.log((new Date()) + ' Received request for ' + req.url);
	gs.reset();
	res.json({result: 'OK'});
});

server.ws('/api/ws', (ws, req) => {
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

module.exports = { gameState: gs, server: myServer };