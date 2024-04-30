import React, { useState } from 'react';
import LocalMode from './localMode/Local';
import OnlineMode from './onlineMode/Online';

function App() {

  const [mode, setMode] = useState('');

  return (
    <div className='flex flex-col items-center justify-center w-full h-full min-h-screen p-2'>
      {
        mode === 'local' ?
          <LocalMode />
          : mode === 'online' ?
            <OnlineMode />
            :
            <div className='flex flex-col items-center gap-4'>
              <h1 className='text-2xl font-bold text-white underline underline-offset-4'>Yazi Game</h1>
              <h2 className='text-xl font-bold text-white'>Choose mode</h2>
              <div className='flex gap-4 mt-4'>
                <button onClick={() => setMode('local')} className='w-20 h-10 text-white bg-blue-500 rounded'>Local</button>
                <button onClick={() => setMode('online')} className='w-20 h-10 text-white bg-blue-500 rounded'>Online</button>
              </div>
            </div>
      }
    </div>
  );
}

export default App;
