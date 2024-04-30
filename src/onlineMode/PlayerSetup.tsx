import React, { useState } from 'react';

interface PlayerSetupProps {
  onJoinGame: (username: string) => void; // Changed to accept a single username
}

const PlayerSetup: React.FC<PlayerSetupProps> = ({ onJoinGame }) => {
  const [username, setUsername] = useState("");
  const [joinned, setJoinned] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (username.trim() !== "") {
      onJoinGame(username);
      setUsername("");
      setJoinned(true);
    } else {
      alert('Please enter a username.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center w-full gap-6">
      <h1 className="text-xl font-bold text-white">Enter Player Name</h1>
      <input
        type="text"
        placeholder="Player Name"
        value={username}
        disabled={joinned}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-1 border rounded"
      />
      <button type="submit" className="w-full px-4 py-2 text-white transition-all duration-200 bg-blue-500 rounded hover:bg-blue-700 ">Join Game</button>
    </form>
  );
};

export default PlayerSetup;
