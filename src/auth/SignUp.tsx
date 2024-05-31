import React, { useState } from 'react';

import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { create } from '../server';

export default function SignUp() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const signup = async () => {
        if (email === '' || password === '') {
            alert('Please fill in all the inputs.');
            return;
        }
        await createUserWithEmailAndPassword(auth, `${email}@yazi.online`, password)
            .then(async () => {
                await create('users', email, {email, points: 0, credit: 0, wonGames: 0, highScore: 0, matchPlayed: 0}, '', () => {
                    navigate('/lobby');
                });
            })
            .catch(() => {
                alert('Invalid Email or Password.');
                return;
            });
    }


    return (
        <div className='flex flex-col items-center justify-center w-full min-h-screen text-white bg-darkgray'>
            <h2 className='text-[1.2rem] text-[var(--stats)] font-bold mb-8'>WELCOME TO MOG NATION</h2>
            <div className='flex flex-col gap-6'>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className='input' placeholder='| Email' />
                <div className='relative'>
                    <input
                        type={showPassword ? 'text' : 'password'}
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

