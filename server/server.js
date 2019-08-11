const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);
const path = require('path');

app.use(express.static(path.join(__dirname, '..', 'client')));

const state = {
  score: {
    player1: 0,
    player2: 0,
  },
  playerOneState: {
    direction: null,
    x: 100,
    y: 360,
  },
  playerTwoState: {
    direction: null,
  },
  playerIds: [],
  playerCount: 0,
  ball: {
    x: 0,
    y: 0,
  },
  bumper1: {
    y: 0,
  },
  bumper2: {
    y: 0,
  },
};

io.on('connection', socket => {
  console.log('Someone connected', socket.id);

  if (!state.playerIds.includes(socket.id)) {
    state.playerIds.push(socket.id);
    state.playerCount++;
    console.log('num players', state.playerCount);
  }
  socket.on('disconnect', () => {
    console.log('a player disconnected');
    const i = state.playerIds.indexOf(socket.id);
    state.playerIds.splice(i, 1);
    state.playerCount--;
    console.log('num players:', state.playerCount);
    //reset score when lobby is empty
    if (state.playerCount === 0) {
      state.score = {
        player1: 0,
        player2: 0,
      };
    }
  });

  // handle messages from any client
  socket.emit(
    'message',
    `Welcome! Forestpong fully supports trash talk so have at it.`
  ); // emits to one person
  socket.on('message', text => {
    //handle messages from single client
    io.emit(
      'message',
      `player ${state.playerIds.indexOf(socket.id) + 1}: ${text}`
    ); // send chat message to everyone that is connected, included client itself
    // if we did socket.emit it would send the message to a particular client
  });

  socket.on('dir', (dir, isFirstPlayer) => {
    if (isFirstPlayer) {
      state.playerOneState.direction = dir;
    } else {
      state.playerTwoState.direction = dir;
    }
  });
  socket.on('p1scored', () => {
    state.score.player1++;
  });
  socket.on('p2scored', () => {
    state.score.player2++;
  });
  socket.on('ballMoved', (ballX, ballY) => {
    state.ball.x = ballX;
    state.ball.y = ballY;
  });
  socket.on('bumpersMoved', (bumper1y, bumper2y) => {
    state.bumper1.y = bumper1y;
    state.bumper2.y = bumper2y;
  });

  socket.on('p1moved', (p1x, p1y) => {
    state.playerOneState.x = p1x;
    state.playerOneState.y = p1y;
  });
});

setInterval(() => {
  io.emit('state', state);
}, 10);

server.on('error', err => {
  console.error('Server error:', err);
});

server.listen(process.env.PORT || 3000, function() {
  // Listens to port 3000
  console.log('Listening on ' + server.address().port);
});
