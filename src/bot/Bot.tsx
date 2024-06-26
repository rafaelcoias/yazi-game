import React, { useState } from 'react';
import User from './User';
import PlayerSetup from './PlayerSetup';
import DiceGame from './Game';

function BotGame() {

  const botUser = new User(1, "Bot");

  const [users, setUsers] = useState<any>([]);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const startGame = (player: User) => {
    setUsers([player, botUser]);
    setGameStarted(true);
  };

  return (
    <div className='flex items-center justify-center w-full h-full min-h-screen p-2 text-white'>
      {/* {!gameStarted ? (
        <PlayerSetup onStartGame={(player:any) => startGame(player)} />
      ) : (
        <DiceGame users={users} setUsers={setUsers} />
      )} */}
      In construction...
    </div>
  );
}

export default BotGame;
