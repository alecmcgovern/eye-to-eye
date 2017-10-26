import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:8000');
// const socket = openSocket(window.location.hostname);

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

function subscribeToShowImage(callback) {
	socket.on('toggleShowImageReceived', showImage => callback(null, showImage));
}

function toggleShowImage(showImage) {;
	socket.emit('toggleShowImage', showImage);
}

function subscribeToClearCanvas(callback) {
	socket.on('clearCanvasReceived', () => callback(null));
}

function clearCanvas() {
	socket.emit('clearCanvas');
}

function subscribeToChangeImageUrl(callback) {
	socket.on('changeImageUrlReceived', (imageUrl) => callback(null, imageUrl));
}

function changeImageUrl(imageUrl) {
	socket.emit('changeImageUrl', imageUrl);
}

function subscribeToSetBackgroundColor(callback) {
	socket.on('setBackgroundColorReceived', (color) => callback(null, color));
}

function setBackgroundColor(color) {
	socket.emit('setBackgroundColor', color);
}

export { sendMessage, subscribeToMessages, sendSketch, subscribeToSketches, toggleShowImage, subscribeToShowImage, clearCanvas, subscribeToClearCanvas, 
	subscribeToChangeImageUrl, changeImageUrl, setBackgroundColor, subscribeToSetBackgroundColor }




