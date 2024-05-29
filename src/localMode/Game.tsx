import React, { useEffect, useState } from 'react';
import ScoreTable from './ScoreTable';
import User from './User';
import BigDice from './BigDice';

interface Dice {
  value: number;
  isHeld: boolean;
}

const initialDice: Dice[] = Array(5).fill({ value: 1, isHeld: false });

function DiceGame({ users, setUsers }: { users: User[], setUsers: any }) {

  const [dice, setDice] = useState<Dice[]>(initialDice);
  const [rollCount, setRollCount] = useState<number>(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [hasRolled, setHasRolled] = useState<boolean>(false);
  const [currentPlayer, setCurrentPlayer] = useState<User>(users[0]);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [winner, setWinner] = useState<any>();

  useEffect(() => {
    setCurrentPlayer(users?.[currentPlayerIndex]);
    document.body.style.backgroundColor = users?.[currentPlayerIndex]?.color; 
  }, [currentPlayerIndex, users]);

  const handleScoreUpdate = (userId: number, lineId: number, score: number) => {
    if (!hasRolled) {
      alert("You need to roll the dice first!");
      return;
    }

    if (userId !== currentPlayerIndex) {
      alert("It's not your turn!");
      return;
    }

    if (currentPlayer && currentPlayer.scores[lineId] !== -1) {
      alert("This line has already been scored. Please choose another.");
      return;
    }

    const diceValues = dice.map(d => d.value);
    const lineScore = calculateScore(lineId, diceValues);

    const newUsers = [...users];
    newUsers[userId].updateScore(lineId, lineScore);
    setUsers(newUsers);

    if (checkGameCompletion(users)) {
      document.body.style.backgroundColor = '';
      const winner = determineWinner(users);
      setWinner({
        username: winner.username,
        totalPoints: winner.totalPoints,
      });
      setGameEnded(true);
    }

    endTurn();
  };

  function checkGameCompletion(users: any) {
    return users.every((user: any) => user?.scores?.every((score: number) => score !== -1));
  }

  function determineWinner(users: any) {
    return users.reduce((prev: any, current: any) => (prev.totalPoints > current.totalPoints) ? prev : current);
  }

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

  const rollDice = () => {
    if (rollCount < 3) {
      setDice(dice.map(dice => dice.isHeld ? dice : { ...dice, value: Math.ceil(Math.random() * 6) }));
      setRollCount(rollCount + 1);
      setHasRolled(true);
    } else {
      alert('No more rolls left, please choose a score slot.');
    }
  };

  const toggleHoldDice = (index: number) => {
    if (!hasRolled) {
      alert("You need to roll the dice first!");
      return;
    }
    const newDice = [...dice];
    newDice[index].isHeld = !newDice[index].isHeld;
    setDice(newDice);
  };

  const endTurn = () => {
    setCurrentPlayerIndex((prev: number) => (prev + 1) % users.length);
    setDice(initialDice.map(d => ({ ...d, isHeld: false })));
    setRollCount(0);
    setHasRolled(false);
    document.body.style.backgroundColor = users?.[currentPlayerIndex]?.color; 
  };

  return (
    <div className="game w-[20rem] flex flex-col items-center justify-center">
      {
        gameEnded ?
          <h1 className='mb-4 text-white'>The mogger is {winner.username} with {winner.totalPoints} points!</h1>
          :
          <h1 className='mb-4 text-white'>Playing: {currentPlayer?.username}</h1>
      }
      <div className="bg-[#414951] rounded-[10px] p-4 flex flex-col gap-4 w-full">
        <ScoreTable users={users} onScore={handleScoreUpdate} diceValues={dice.map(d => d.value)} currentPlayerIndex={currentPlayerIndex} calculateScore={calculateScore} hasRolled={hasRolled} />
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
