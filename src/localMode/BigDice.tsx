import React from 'react';

export default function BigDice({ ...props }) {
    return (
        <div className={`w-12 h-12 p-1 bg-[#eee] rounded-[10px] border-[3.5px] border-black grid grid-cols-3 cursor-pointer ${props?.isHeld ? 'border-green-500 shadow-2xl shadow-green-500' : ''}`}>
            <div className={`w-[8px] h-[8px] bg-black rounded-full justify-self-center self-center ${props?.number === 4 || props?.number === 5 || props?.number === 6 ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className={`w-[8px] h-[8px] bg-black rounded-full justify-self-center self-center ${props?.number === -1 ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className={`w-[8px] h-[8px] bg-black rounded-full justify-self-center self-center ${props?.number !== 1 ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className={`w-[8px] h-[8px] bg-black rounded-full justify-self-center self-center ${props?.number === 6 ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className={`w-[8px] h-[8px] bg-black rounded-full justify-self-center self-center ${props?.number === 1 || props?.number === 3 || props?.number === 5 ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className={`w-[8px] h-[8px] bg-black rounded-full justify-self-center self-center ${props?.number === 6 ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className={`w-[8px] h-[8px] bg-black rounded-full justify-self-center self-center ${props?.number !== 1 ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className={`w-[8px] h-[8px] bg-black rounded-full justify-self-center self-center ${props?.number === -1 ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className={`w-[8px] h-[8px] bg-black rounded-full justify-self-center self-center ${props?.number === 4 || props?.number === 5 || props?.number === 6 ? 'opacity-100' : 'opacity-0'}`}></div>
        </div >
    );
}

