import React from 'react';
import User from './User'; // Import the User type
import Dice from './Dice';

interface ScoreTableProps {
    users: User[];
    onScore: (userId: number, lineId: number, score: number) => void; // Update the signature to include the score
    currentPlayerIndex: number;
    diceValues: number[];
    calculateScore: (lineId: number, diceValues: number[]) => number;
    hasRolled: boolean;
}

const scoringImages = [
    { alt: 'Combination 1', src: '/table/1.png', score: 0 },
    { alt: 'Combination 2', src: '/table/2.png', score: 0 },
    { alt: 'Combination 3', src: '/table/3.png', score: 0 },
    { alt: 'Combination 4', src: '/table/4.png', score: 0 },
    { alt: 'Combination 5', src: '/table/5.png', score: 0 },
    { alt: 'Combination 6', src: '/table/6.png', score: 0 },
    { alt: 'Combination 7', src: '/table/triple.png', score: 0 },
    { alt: 'Combination 8', src: '/table/quadruple.png', score: 0 },
    { alt: 'Combination 9', src: '/table/fullhouse.png', score: 25 },
    { alt: 'Combination 10', src: '/table/sequence.png', score: 40 },
    { alt: 'Combination 11', src: '/table/all.png', score: 50 },
];

const ScoreTable: React.FC<ScoreTableProps> = ({ users, onScore, diceValues, calculateScore, currentPlayerIndex, hasRolled }) => {

    const getPlayerColor = (index: number): string => {
        switch (index) {
            case 0:
                return 'bg-[#60a5fa]';
            case 1:
                return 'bg-[#f87171]';
            case 2:
                return 'bg-[#facc15]';
            case 3:
                return 'bg-[#4ade80]';
            case 4:
                return 'bg-[#38ddf8]';
            case 5:
                return 'bg-[#fb923c]';
            case 6:
                return 'bg-[#34A399]';
            case 7:
                return 'bg-[#c084fc]';
            case 8:
                return 'bg-[#a3e635]';
            case 9:
                return 'bg-[#dcbf0a]';
            default:
                return '';
        }
    };

    const getTotalPoints = (scores: any) => {
        let total = 0;
        Object.values(scores).forEach((value: any) => {
            if (value !== -1) {
                total += value;
            }
        });
        return total;
    };

    return (
        <div className="overflow-x-auto w-full p-2 bg-[#fdf8e3] rounded-[8px]">
            <table className="rounded-[8px] w-full overflow-hidden">
                <thead className="bg-[#f7d9a3]">
                    <tr className='border-b border-white'>
                        <th className="text-left w-[5rem] text-[.7rem] pl-2">Players:</th>
                        {users.map((user, index) => {
                            return (
                                <th key={index} className="w-[5rem] text-[.6rem] py-1">
                                    <p>{user?.username}</p>
                                    <p>{getTotalPoints(user?.scores)}</p>
                                </th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {scoringImages.map((image, imageIndex) => (
                        <tr className="bg-[#f7d9a3] rounded-[8px] border-b border-[#fdf8e3]" key={imageIndex}>
                            <td className="min-h-9 h-full py-1 px-2 flex items-center w-[6rem] border-r border-[#fdf8e3]">
                                {imageIndex < 6 ? (
                                    <Dice number={imageIndex + 1} />
                                ) : (
                                    <img src={image?.src} alt={image?.alt} className="object-cover w-full mr-2 max-h-7" />
                                )}
                            </td>
                            {
                                users.map((user: any, userIndex: number) => {
                                    return (
                                        <td
                                            key={userIndex}
                                            className='p-[6px] h-[8px]'
                                        >
                                            <button
                                                className={`cursor-pointer w-full h-full flex items-center justify-center rounded-[5px] ${currentPlayerIndex === userIndex ? 'shadow-md shadow-gray-500' : ''} ${user?.scores[imageIndex] !== -1 ? 'bg-[#ffe9c0] shadow-none' : getPlayerColor(userIndex)}`}
                                                onClick={() => onScore(userIndex, imageIndex, image.score)}
                                                disabled={currentPlayerIndex !== userIndex}
                                            >
                                                <p className='w-full text-center'>{user?.scores[imageIndex] !== -1 ? user?.scores[imageIndex] : (hasRolled && currentPlayerIndex === userIndex) ? calculateScore(imageIndex, diceValues) : ''}</p>
                                            </button>
                                        </td>
                                    )
                                })
                            }
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ScoreTable;