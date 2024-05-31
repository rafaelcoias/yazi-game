import React from 'react';
import Login from './auth/Login';
import Main from './Main';
import SignUp from './auth/SignUp';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <div className='relative flex flex-col items-center justify-center w-full h-full min-h-screen p-2 z-[1]'>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path={'/register'} element={<SignUp />} />
          <Route path={'/lobby'} element={<Main />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
