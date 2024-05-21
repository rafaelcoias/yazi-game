import React, { useState } from 'react';
import User from './User';

interface PlayerSetupProps {
  onStartGame: (player: User) => void;
}

const PlayerSetup: React.FC<PlayerSetupProps> = ({ onStartGame }) => {
  const [username, setUsername] = useState<string>("");

  const handleChange = (value: string) => {
    setUsername(value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (username.trim() !== "") {
      const user = new User(0, username.trim());
      onStartGame(user);
    } else {
      alert('Please enter your name.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center gap-6">
      <h1 className="text-xl font-bold">Enter Your Name</h1>
      <div>
        <input
          type="text"
          placeholder="Your Name"
          value={username}
          onChange={(e) => handleChange(e.target.value)}
          className="p-2 mr-2 border rounded"
        />
      </div>
      <button type="submit" className="px-4 py-2 text-white transition-all duration-200 bg-blue-500 rounded hover:bg-blue-700">
        Start Game
      </button>
    </form>
  );
};

export default PlayerSetup;
