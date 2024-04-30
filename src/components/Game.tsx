import React, { useEffect, useState } from 'react';
import ScoreTable from './ScoreTable';
import User from './User';
import BigDice from './BigDice';
import { useSocket } from '../SocketContext';

interface Dice {
  value: number;
  isHeld: boolean;
}

const initialDice: Dice[] = Array(5).fill({ value: 1, isHeld: false });

interface Props {
  users: User[];
  setUsers: any;
  userId: string | null;
  setUserId: any;
}


const DiceGame: React.FC<Props> = ({ users, setUsers, userId, setUserId }) => {
  const [dice, setDice] = useState<Dice[]>(initialDice);
  const [rollCount, setRollCount] = useState<number>(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [currentPlayer, setCurrentPlayer] = useState<User | undefined>(users[0]);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [winner, setWinner] = useState<any>(undefined);
  const socket = useSocket();

  useEffect(() => {

    // Ensure userID is correctly loaded and managed
    const storedId = localStorage.getItem('userId');
    if (storedId) {
      setUserId(storedId);
    }

    function checkGameCompletion(users: any) {
      return users.every((user: any) => user.scores.every((score: number) => score !== -1));
    }

    function determineWinner(users: any) {
      return users.reduce((prev: any, current: any) => (prev.totalPoints > current.totalPoints) ? prev : current);
    }

    socket?.on('gameStateUpdate', (gameState: any) => {
      setDice(gameState.dice);
      setRollCount(gameState.rollCount);
      setCurrentPlayerIndex(gameState.currentPlayerIndex);
      setUsers(gameState.users);

      if (checkGameCompletion(gameState.users)) {
        const winner = determineWinner(gameState.users);
        setWinner({
          username: winner.username,
          totalPoints: winner.totalPoints
        });
        setTimeout(() => {
          setGameEnded(true);
        }, 2000);
      }
    });

    socket?.on('error', (errorMessage: string) => {
      alert(errorMessage);
    });

    return () => {
      socket?.off('gameStateUpdate');
      socket?.off('error');
    };
  }, [socket, setUsers, currentPlayerIndex, setUserId]);

  useEffect(() => {
    if (currentPlayerIndex < users.length) {
      setCurrentPlayer(users[currentPlayerIndex]);
    }
  }, [currentPlayerIndex, users]);


  const calculateScore = (lineId: number, diceValues: number[]): number => {
    switch (lineId) {
      case 0: // Ones
        return diceValues.filter(value => value === 1).reduce((sum, value) => sum + value, 0);
      case 1: // Twos
        return diceValues.filter(value => value === 2).reduce((sum, value) => sum + value, 0);
      case 2: // Threes
        return diceValues.filter(value => value === 3).reduce((sum, value) => sum + value, 0);
      case 3: // Fours
        return diceValues.filter(value => value === 4).reduce((sum, value) => sum + value, 0);
      case 4: // Fives
        return diceValues.filter(value => value === 5).reduce((sum, value) => sum + value, 0);
      case 5: // Sixes
        return diceValues.filter(value => value === 6).reduce((sum, value) => sum + value, 0);
      case 6: // Triple
        const countsTriple: Record<number, number> = diceValues.reduce((acc, value) => {
          acc[value] = (acc[value] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);
        return Object.values(countsTriple).some((count: number) => count >= 3) ? sumDice(diceValues) : 0;

      case 7: // Quadruple
        const countsQuadruple: Record<number, number> = diceValues.reduce((acc, value) => {
          acc[value] = (acc[value] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);
        return Object.values(countsQuadruple).some((count: number) => count >= 4) ? sumDice(diceValues) : 0;

      case 8: // Full-house
        const countsFullHouse: Record<number, number> = diceValues.reduce((acc, value) => {
          acc[value] = (acc[value] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);
        const valuesFullHouse = Object.values(countsFullHouse);
        return (valuesFullHouse.includes(2) && valuesFullHouse.includes(3)) ? 25 : 0;

      case 9: // Sequence
        const sorted = [...new Set(diceValues)].sort((a, b) => a - b);
        const isSequence = sorted.length === 5 && sorted[4] - sorted[0] === 4;
        return isSequence ? 40 : 0;

      case 10: // All the same
        const allSame = new Set(diceValues).size === 1;
        return allSame ? 50 : 0;

      default:
        return 0;
    }
  };

  const sumDice = (diceValues: number[]): number => {
    return diceValues.reduce((sum, value) => sum + value, 0);
  };

  const optimisticScoreUpdate = (userId: number, lineId: number, score: number) => {
    setUsers((prevUsers: any) => prevUsers.map((user: any) => {
      if (user.id === userId) {
        const updatedScores = [...user.scores];
        updatedScores[lineId] = score;
        return { ...user, scores: updatedScores };
      }
      return user;
    }));
  };



  const handleScoreUpdate = (userId: number, lineId: number) => {
    if (rollCount === 0) {
      alert("You need to roll the dice first!");
      return;
    }

    if (userId !== currentPlayerIndex) {
      alert("It's not your turn!");
      return;
    }

    const scoreValue = calculateScore(lineId, dice.map(d => d.value));

    if (scoreValue !== null) {
      optimisticScoreUpdate(userId, lineId, scoreValue);
      socket?.emit('scoreUpdate', { userId, lineId, score: scoreValue }, (response: any) => {
        if (!response.success) {
          console.error('Failed to update score on server');
        }
      });
    } else {
      alert('Invalid score calculation');
    }
  };


  const toggleHoldDice = (index: number) => {
    if (rollCount === 0) {
      alert("You need to roll the dice first!");
      return;
    }

    if (userId !== users[currentPlayerIndex]?.id) {
      alert("It's not your turn!");
      return;
    }

    socket?.emit('holdDice', index);
  };

  const rollDice = () => {
    if (userId !== currentPlayer?.id) {
      alert("It's not your turn!");
      return;
    }

    if (rollCount < 3) {
      socket?.emit('rollDice');
    } else {
      alert('No more rolls left, please choose a score slot.');
    }
  };


  return (
    <div className="flex flex-col items-center justify-center w-full my-4">
      {
        gameEnded ?
        <h1 className='mb-4 text-white'>The winner is {winner.username} with {winner.totalPoints} points!</h1>
        :
        <h1 className='mb-4 text-white'>Playing: {currentPlayer?.username}</h1>
      }
      <div className="bg-[#414951] rounded-[10px] p-4 flex flex-col gap-4 w-full">
        <ScoreTable
          users={users}
          onScore={handleScoreUpdate}
          diceValues={dice.map(d => d.value)}
          currentPlayerIndex={currentPlayerIndex}
          calculateScore={calculateScore}
          hasRolled={rollCount !== 0}
        />
        <div className="flex gap-1 justify-evenly">
          {dice.map((dice, index) => (
            <div key={index}
              onClick={() => toggleHoldDice(index)}
              className="cursor-pointer"
            >
              <BigDice
                number={dice.value}
                isHeld={dice.isHeld}
              />
            </div>
          ))}
        </div>
        {
          !gameEnded ?
            <button
              className="w-full p-2 mb-4 text-white transition-all duration-200 bg-blue-500 rounded hover:bg-blue-700"
              onClick={rollDice}
              disabled={rollCount >= 3}
            >
              Roll Dice ({3 - rollCount})
            </button>
            :
            <button
              className="w-full p-2 mb-4 text-white transition-all duration-200 bg-yellow-500 rounded hover:bg-yellow-700"
              onClick={() => window.location.reload()}
            >
              Go back to waiting room
            </button>
        }
      </div>
    </div>
  );
};

export default DiceGame;
