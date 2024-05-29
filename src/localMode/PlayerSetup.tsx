import React, { useState } from 'react';
import User from './User';

interface PlayerSetupProps {
  onStartGame: (players: User[]) => void;
}

const PlayerSetup: React.FC<PlayerSetupProps> = ({ onStartGame }) => {
  const [usernames, setUsernames] = useState<string[]>(["", ""]);

  const handleChange = (index: number, value: string) => {
    const updatedUsernames = usernames.map((username, i) => {
      if (i === index) return value;
      return username;
    });
    setUsernames(updatedUsernames);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const users = usernames.filter(name => name.trim() !== "").map((name, index) => new User(index, name.trim()));
    if (users.length >= 2 && users.length <= 4) {
      onStartGame(users);
    } else {
      alert('Please enter between 2 and 4 players.');
    }
  };

  const addUser = () => {
    if (usernames.length < 10) {
      setUsernames([...usernames, ""]);
    } else {
      alert('Maximum of 4 players allowed.');
    }
  };

  const removeUser = (index: number) => {
    if (usernames.length > 2) {
      setUsernames(usernames.filter((_, i) => i !== index));
    } else {
      alert('At least 2 players are required.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center gap-6">
      <h1 className="text-xl font-bold">Enter Player Names</h1>
      <div>
        {usernames.map((username, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              placeholder={`Player ${index + 1} Name`}
              value={username}
              onChange={(e) => handleChange(index, e.target.value)}
              className="p-1 mr-2 border rounded"
            />
            <button type="button" onClick={() => removeUser(index)} className="px-3 py-1 text-white transition-all duration-200 bg-red-500 rounded hover:bg-red-700">Remove</button>
          </div>
        ))}
      </div>
      <div className='flex items-center justify-center w-full gap-4'>
        <button type="button" onClick={addUser} className="px-4 py-2 text-white transition-all duration-200 bg-blue-500 rounded hover:bg-blue-700">
          Add Player
        </button>
        <button type="submit" className="px-4 py-2 text-white transition-all duration-200 bg-blue-500 rounded hover:bg-blue-700">
          Start Game
        </button>
      </div>
    </form>
  );
};

export default PlayerSetup;
