import React from 'react';

export default function Dice({ ...props }) {
    return (
        <div className='w-8 h-8 p-[2px] bg-[#eee] rounded-[5px] border-[3px] border-black grid grid-cols-3'>
            <div className={`w-[7px] h-[7px] bg-black rounded-full justify-self-center self-center ${props?.number === 4 || props?.number === 5 || props?.number === 6 ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className={`w-[7px] h-[7px] bg-black rounded-full justify-self-center self-center ${props?.number === -1 ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className={`w-[7px] h-[7px] bg-black rounded-full justify-self-center self-center ${props?.number !== 1 ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className={`w-[7px] h-[7px] bg-black rounded-full justify-self-center self-center ${props?.number === 6 ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className={`w-[7px] h-[7px] bg-black rounded-full justify-self-center self-center ${props?.number === 1 || props?.number === 3 || props?.number === 5 ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className={`w-[7px] h-[7px] bg-black rounded-full justify-self-center self-center ${props?.number === 6 ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className={`w-[7px] h-[7px] bg-black rounded-full justify-self-center self-center ${props?.number !== 1 ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className={`w-[7px] h-[7px] bg-black rounded-full justify-self-center self-center ${props?.number === -1 ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className={`w-[7px] h-[7px] bg-black rounded-full justify-self-center self-center ${props?.number === 4 || props?.number === 5 || props?.number === 6 ? 'opacity-100' : 'opacity-0'}`}></div>
        </div >
    );
}

