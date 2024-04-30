import React, { useState, useEffect } from 'react';
import { useSocket } from './SocketContext';
import PlayerSetup from './components/PlayerSetup';
import DiceGame from './components/Game';

export default function App() {
  const socket = useSocket();
  const [users, setUsers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameReady, setGameReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));

  useEffect(() => {
    // Load userId from local storage when the component mounts
    const storedId = localStorage.getItem('userId');
    if (storedId) {
      setUserId(storedId);
    }

    // Additional socket event listeners
    socket?.on('gameStateUpdate', (gameState) => {
      setUsers(gameState.users);
      setGameReady(gameState.users.length >= 2);
    });

    socket?.on('gameStarted', (gameState) => {
      setUsers(gameState.users);
      setGameStarted(true);
    });

    return () => {
      socket?.off('gameStateUpdate');
      socket?.off('gameStarted');
    };
  }, [socket]); // Note: adding socket as a dependency here

  const handleJoinGame = (username: string) => {
    if (socket) {
      socket.emit('joinGame', username, (response:any) => {
        if (response && response.id) {
          localStorage.setItem('userId', response.id);
          setUserId(response.id);
        } else {
          console.error('Failed to receive a valid user ID.');
        }
      });
    } else {
      console.error('Socket not connected');
    }
  };

  const startGame = () => {
    if (socket && gameReady) {
      socket.emit('startGame');
    }
  };

  return (
    <div className='w-[20rem] flex justify-center min-h-screen h-full'>
      {!gameStarted ? (
        <div className='flex flex-col items-center justify-center w-full h-screen gap-10'>
          <PlayerSetup onJoinGame={handleJoinGame} />
          <div className='flex flex-col w-full gap-4 text-white'>
            <h2>Waiting Room:</h2>
            {users.map((user: any, index:number) => (
              <div key={user?.id}>{index + 1}. {user?.username}</div>
            ))}
            {gameReady && <button className="px-4 py-2 text-white transition-all duration-200 bg-blue-500 rounded hover:bg-blue-700" onClick={startGame}>Start Game</button>}
          </div>
        </div>
      ) : (
        <DiceGame users={users} setUsers={setUsers} userId={userId} setUserId={setUserId} />
      )}
    </div>
  );
}

