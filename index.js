const express = require('express');
const path = require('path');
const app = express();

const server = require('http').createServer(app);

const io = require('socket.io')(server);

const PORT = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
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


server.listen(PORT, () => {
	console.log('App listening on port '+ PORT);
})