const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);
const path = require('path');

app.use(express.static(path.join(__dirname, '..', 'client')));

io.on('connection', socket => {
  // handle messages from any client
  console.log('Someone connected', socket.id);
  socket.emit('message', 'Welcome from the server!'); // emits to one person

  socket.on('message', text => {
    //handle messages from single client
    io.emit('message', text); // send chat message to everyone that is connected, included client itself
    // if we did socket.emit it would send the message to a particular client
  });

  socket.on('p1direction', direction => {
    io.emit('p1direction', direction);
  });

  socket.on('p2direction', direction => {
    io.emit('p2direction', direction);
  });
});

server.on('error', err => {
  console.error('Server error:', err);
});

server.listen(8081, function() {
  // Listens to port 8081
  console.log('Listening on ' + server.address().port);
});
