import React, { useState } from 'react';
import User from './User';
import PlayerSetup from './PlayerSetup';
import DiceGame from './Game';

function LocalGame() {

  const [users, setUsers] = useState<User[]>([]);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const startGame = (players: User[]) => {
    setUsers(players);
    setGameStarted(true);
  };

  return (
    <div className='w-full flex justify-center min-h-screen h-full bg-[#76b34c] p-2'>
      {!gameStarted ? (
        <PlayerSetup onStartGame={startGame} />
      ) : (
        <DiceGame users={users} setUsers={setUsers} />
      )}
    </div>
  );
}

export default LocalGame;
