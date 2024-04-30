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

app.get('/', (req, res) => {
  res.send('Hello World!');
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.emit('gameStateUpdate', gameState);

  socket.on('joinGame', (username, callback) => {
    const id = socket.id;
    const newUser = {
      id: id,
      username: username,
      totalPoints: 0,
      scores: Array(11).fill(-1)
    };
  
    gameState.users.push(newUser);
    io.emit('gameStateUpdate', gameState);
    callback({ id: id });
  }); 

  socket.on('startGame', () => {
    if (gameState.users.length >= 2) {
      gameState.currentPlayerIndex = 0; // Ensure this is correctly set
      gameState.rollCount = 0; // Reset roll count
      io.emit('gameStarted', gameState); // Notify all clients that the game has started
      console.log('Game started with players:', gameState.users.map(user => user.username));
    } else {
      socket.emit('error', 'Not enough players to start the game');
    }
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
    if (userId !== gameState.currentPlayerIndex) {
      socket.emit('error', 'It\'s not your turn!');
      return;
    }
  
    let user = gameState.users[userId];
    if (!user) {
      socket.emit('error', 'User not found');
      return;
    }
  
    if (gameState.rollCount === 0) {
      socket.emit('error', 'Please roll the dice first');
      return;
    }
  
    if (lineId < 0 || lineId >= user.scores.length) {
      socket.emit('error', 'Invalid score line selected');
      return;
    }
  
    if (user.scores[lineId] !== -1) {
      socket.emit('error', 'Score already set for this line');
      return;
    }
  
    user.scores[lineId] = score;
    user.totalPoints += score;
    gameState.rollCount = 0; 
    gameState.dice = Array(5).fill({ value: 1, isHeld: false });
    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.users.length;
    io.emit('gameStateUpdate', gameState);
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
