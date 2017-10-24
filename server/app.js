const express = require('express');
const path = require('path');
const app = express();

const server = require('http').createServer(app);

const io = require('socket.io')(server);

const PORT = process.env.PORT || 8000;

app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});


io.on('connection', function(client) {
	console.log('client connected!');

	client.on('subscribeToTimer', (interval) => {
		console.log('client is subscribing to timer with interval ', interval);
		setInterval(() => {
			client.emit('timer', new Date());
		}, interval);
	});
});

module.exports = server;