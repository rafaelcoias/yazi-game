const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let gameState = {
  users: [],
  dice: Array(5).fill({ value: 1, isHeld: false }),
  currentPlayerIndex: 0,
  rollCount: 0
};

function rollDice() {
  return gameState.dice.map(die => die.isHeld ? die : { ...die, value: Math.ceil(Math.random() * 6) });
}

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('joinGame', (username) => {
    if (!username || gameState.users.some(user => user.username === username)) {
      socket.emit('error', 'Username is required or already in use');
      return;
    }
    const user = { id: socket.id, username, scores: Array(11).fill(-1), totalPoints: 0 };
    gameState.users.push(user);
    io.emit('gameStateUpdate', gameState);
    console.log(`User ${username} joined the game`);
  });

  socket.on('rollDice', () => {
    if (gameState.rollCount < 3) {
      gameState.dice = rollDice();
      gameState.rollCount++;
      io.emit('gameStateUpdate', gameState);
    } else {
      socket.emit('error', 'No more rolls left');
    }
  });

  socket.on('holdDice', (index) => {
    if (index < 0 || index >= gameState.dice.length) {
      socket.emit('error', 'Invalid dice index');
      return;
    }
    gameState.dice[index].isHeld = !gameState.dice[index].isHeld;
    io.emit('gameStateUpdate', gameState);
  });

  socket.on('scoreUpdate', ({ userId, lineId, score }) => {
    let user = gameState.users.find(user => user.id === userId);
    if (user && lineId >= 0 && lineId < user.scores.length && user.scores[lineId] === -1) {
      user.scores[lineId] = score;
      user.totalPoints += score;
      gameState.rollCount = 0;
      gameState.dice = Array(5).fill({ value: 1, isHeld: false });
      gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.users.length;
      io.emit('gameStateUpdate', gameState);
    } else {
      socket.emit('error', 'Invalid score update');
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    gameState.users = gameState.users.filter(user => user.id !== socket.id);
    if (gameState.currentPlayerIndex >= gameState.users.length) {
      gameState.currentPlayerIndex = 0;
    }
    io.emit('gameStateUpdate', gameState);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
