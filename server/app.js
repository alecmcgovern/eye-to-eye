const express = require('express');
const path = require('path');
const app = express();

const server = require('http').createServer(app);

const io = require('socket.io')(server);


app.use(express.static(path.resolve(__dirname, '..', 'public')));

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
});


io.on('connection', function(client) {
	console.log('client connected!');

	client.on('subscribeToTimer', (interval) => {
		console.log('client is subscribing to timer with interval', interval);
		setInterval(() => {
			client.emit('timer', new Date());
		}, interval);
	});

	client.on('sendMessage', (message) => {
		console.log("client sent this message: " + message);
		io.emit('messageReceived', message);
	});
});

module.exports = server;