import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:8000');
// const socket = openSocket(window.location.hostname);

function subscribeToTimer(callback) {
	socket.on('timer', timestamp => callback(null, timestamp));
	socket.emit('subscribeToTimer', 1000);
} 

function subscribeToMessages(callback) {
	socket.on('messageReceived', messageReceived => callback(null, messageReceived));
}

function sendMessage(message) {
	socket.emit('sendMessage', message);
}

function subscribeToSketches(callback) {
	socket.on('sketchReceived', sketch => callback(null, sketch));
}

function sendSketch(sketch) {
	socket.emit('sendSketch', sketch);
}

export { subscribeToTimer, sendMessage, subscribeToMessages, sendSketch, subscribeToSketches }