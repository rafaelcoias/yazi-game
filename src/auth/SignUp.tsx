import React, { useState } from 'react';

import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { create } from '../server';

export default function SignUp() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const signup = async () => {
        if (username === '' || password === '') {
            alert('Please fill in all the inputs.');
            return;
        }
        await createUserWithEmailAndPassword(auth, `${username.toLowerCase()}@yazi.online`, password)
            .then(async () => {
                await create('users', username.toLowerCase(), {username: username.toLowerCase(), name: username.toLowerCase(), score: 0, credit: 0, wonGames: 0, highScore: 0, matchPlayed: 0}, '', () => {
                    navigate('/lobby');
                });
            })
            .catch(() => {
                alert('Invalid Username or Password.');
                return;
            });
    }


    return (
        <div className='flex flex-col items-center justify-center w-full min-h-screen text-white bg-darkgray'>
            <h2 className='text-[1.2rem] text-[var(--stats)] font-bold mb-8'>WELCOME TO MOG NATION</h2>
            <div className='flex flex-col gap-6'>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className='lowercase input' placeholder='| Username' />
                <div className='relative'>
                    <input
                        type={'password'}
                        placeholder='| Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='appearance-none input'
                    />
                </div>
                <button onClick={signup} className='small-button bg-[var(--primary)] py-2 rounded-full'><p className='w-full text-center'>Sign Up</p></button>
                <p className='w-full text-center'>Or&ensp; <button onClick={() => navigate('/')} className='text-[var(--blue)] hover:underline'>Login</button></p>
            </div>
        </div>
    );
}

