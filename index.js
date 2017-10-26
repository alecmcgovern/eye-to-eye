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

	client.on('sendMessage', (message) => {
		console.log("client sent this message: " + message);
		io.emit('messageReceived', message);
	});

	client.on('sendSketch', (sketch) => {
		console.log("client sent this sketch: " + sketch);
		io.emit('sketchReceived', sketch);
	});

	client.on('toggleShowImage', (showImage) => {
		io.emit('toggleShowImageReceived', showImage);
	});

	client.on('clearCanvas', () => {
		io.emit('clearCanvasReceived');
	});

	client.on('changeImageUrl', (imageUrl) => {
		io.emit('changeImageUrlReceived', imageUrl);
	});

	client.on('setBackgroundColor', (color) => {
		io.emit('setBackgroundColorReceived', color);
	});
});


server.listen(PORT, () => {
	console.log('App listening on port '+ PORT);
})