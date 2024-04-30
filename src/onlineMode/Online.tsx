import React, { useState, useEffect } from 'react';
import { useSocket } from '../SocketContext';
import PlayerSetup from './PlayerSetup';
import DiceGame from './Game';

export default function OnlineGame() {
  const socket = useSocket();
  const [users, setUsers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameReady, setGameReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));
  const [messages, setMessages] = useState<any[]>([]);
  const [chatMessage, setChatMessage] = useState('');

  useEffect(() => {
    // Load userId from local storage when the component mounts
    const storedId = localStorage.getItem('userId');
    if (storedId) {
      setUserId(storedId);
    }

    socket?.on('messageReceived', (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    // Additional socket event listeners
    socket?.on('gameStateUpdate', (gameState) => {
      setUsers(gameState.users);
      setGameReady(gameState.users.length >= 2);
    });

    socket?.on('gameStarted', (gameState) => {
      setUsers(gameState.users);
      setGameStarted(true);
      document.body.style.backgroundColor = gameState.users[gameState.currentPlayerIndex].color;
    });

    return () => {
      socket?.off('gameStateUpdate');
      socket?.off('gameStarted');
      socket?.off('messageReceived');
    };
  }, [socket]);

  const handleSendMessage = () => {
    if (socket && chatMessage.trim()) {
      socket.emit('sendMessage', chatMessage.trim());
      setChatMessage('');
    }
  };

  const handleChatInputChange = (event: any) => {
    setChatMessage(event.target.value);
  };

  const handleJoinGame = (username: string) => {
    if (socket) {
      socket.emit('joinGame', username, (response: any) => {
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

  function formatTime(isoString: string) {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }


  return (
    <div className='w-[20rem] flex justify-center min-h-screen h-full'>
      {!gameStarted ? (
        <div className='flex flex-col items-center justify-center w-full h-screen gap-10'>
          <PlayerSetup onJoinGame={handleJoinGame} />
          <div className='flex flex-col w-full gap-4 text-white'>
            <h2>Waiting Room:</h2>
            {users.map((user: any, index: number) => (
              <div key={user?.id}>{index + 1}. {user?.username}</div>
            ))}
            {gameReady && <button className="px-4 py-2 text-white transition-all duration-200 bg-blue-500 rounded hover:bg-blue-700" onClick={startGame}>Start Game</button>}
          </div>
          <div className='w-full py-4 text-white border-t'>
            <h2>Chat:</h2>
            <div className="flex flex-col gap-4">
              <div className="">
                {messages.map((msg, index) => (
                  <div key={index} className="">
                    <strong>{msg.username}</strong>: {msg.message}
                  </div>
                ))}
              </div>
              <div className="flex">
                <input className="w-full p-1 text-black border rounded" type="text" value={chatMessage} onChange={handleChatInputChange} placeholder="Type a message..." />
                <button className="px-4 py-2 text-white transition-all duration-200 bg-blue-500 rounded hover:bg-blue-700" onClick={handleSendMessage}>Send</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='flex flex-col w-full gap-8'>
          <DiceGame users={users} setUsers={setUsers} userId={userId} setUserId={setUserId} />
          <div className='w-full text-white rounded-[20px] border mb-8 overflow-hidden'>
            <h2 className='py-2 text-center text-black bg-[#ddd]'>Chat</h2>
            <div className="flex flex-col rounded-[20px]">
              <div className="max-h-[20rem] overflow-x-hidden overflow-y-auto min-h-[10rem]">
                {messages.map((msg, index) => (
                  <div key={index} className="p-1 text-black bg-[#ddd] border-2 flex justify-between items-center gap-4">
                    <p className=''>{msg.username} says: <span className='font-normal'>{msg.message}</span></p>
                    <p className='text-[.6rem]'>{formatTime(msg.timestamp)}</p>
                  </div>
                ))}
              </div>
              <div className="flex">
                <input className="w-full p-1 text-black border rounded" type="text" value={chatMessage} onChange={handleChatInputChange} placeholder="Type a message..." />
                <button className="px-4 py-2 text-white transition-all duration-200 bg-blue-500 rounded hover:bg-blue-700" onClick={handleSendMessage}>Send</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

