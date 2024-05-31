import React, { useState } from 'react';
import LocalMode from './localMode/Local';
import OnlineMode from './onlineMode/Online';
import BotMode from './bot/Bot';

function App() {

  const [mode, setMode] = useState('');

  return (
    <div className='relative flex flex-col items-center justify-center w-full h-full min-h-screen p-2 z-[1]'>
      {
        mode === 'local' ?
          <LocalMode />
          : mode === 'online' ?
            <OnlineMode />
            :
            mode === 'bot' ?
            <BotMode />
            :
            <div className='flex flex-col items-center gap-4 z-[1] relative'>
              <h1 className='text-2xl font-bold text-white underline underline-offset-4'>Yazi Game</h1>
              <h2 className='text-xl font-bold text-white'>Choose mode</h2>
              <div className='flex gap-4 mt-4'>
                <button onClick={() => setMode('local')} className='w-20 h-10 text-white bg-yellow-500 rounded'>Local</button>
                <button onClick={() => setMode('bot')} className='w-20 h-10 text-white bg-red-500 rounded'>Bot</button>
                <button onClick={() => setMode('online')} className='w-20 h-10 text-white bg-blue-500 rounded'>Online</button>
              </div>
            </div>
      }
    </div>
  );
}

export default App;
