import React, { useEffect, useState } from 'react';

import { auth } from '../firebase.js';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Login() {
    const navigate = useNavigate();
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async user => {
            if (user)
                navigate('/lobby');
        });
        return () => unsubscribe();
    }, [navigate]);

    const login = async () => {
        if (username === '' || password === '') {
            alert('Please fill in all the inputs.');
            return;
        }
        await signInWithEmailAndPassword(auth, `${username.toLowerCase()}@yazi.online`, password)
            .then(async () => {
                navigate('/lobby');
            })
            .catch((e) => {
                alert('Invalid username and password');
                console.error('Error logging in:', e);
                return;
            });
    }


    return (
        <div className='flex flex-col items-center justify-center w-full min-h-screen text-white bg-darkgray'>
            <h2 className='text-[1.2rem] text-[var(--stats)] font-bold mb-8'>YAZI</h2>
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
                <button onClick={login} className='small-button bg-[var(--primary)] py-2 rounded-full'><p className='w-full text-center'>Login</p></button>
                <p className='w-full text-center'>Or&ensp; <button onClick={() => navigate('/register')} className='text-[var(--blue)] hover:underline'>Sign Up</button></p>
            </div>
        </div>
    );
}

