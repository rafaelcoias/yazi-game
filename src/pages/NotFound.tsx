import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
    const navigate = useNavigate();
    return (
        <div className='flex flex-col items-center justify-center w-full min-h-screen gap-4 text-white bg-darkgray'>
            <h1 className='text-[3.5rem]'>404 Error</h1>
            <p className='text-[1.2rem]'>Page not found</p>
            <p className='text-[1.2rem] cursor-pointer' onClick={() => navigate(-1)}>🡐&ensp;Voltar</p>
        </div>
    );
}

