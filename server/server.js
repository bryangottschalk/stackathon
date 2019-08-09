const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);
const path = require('path')

app.use(express.static(path.join(__dirname, '..', 'public')))

io.on('connection', (socket) => {
  socket.emit('message', 'Hi, you are connected!')
})
// app.use('/js', express.static(__dirname.join('/js')));

// app.get('/', function(req, res) {
//   res.sendFile(__dirname + '/index.html');
// });

// app.get('/', function(req, res) {
//   res.sendFile(__dirname + '/index.html');
// });

server.on('error', (err) => {
  console.error('Server error:', err)
})

server.listen(8081, function() {
  // Listens to port 8081
  console.log('Listening on ' + server.address().port);
});
