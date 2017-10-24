
const server = require('./server/app');

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
	console.log('App listening on port '+ PORT);
})