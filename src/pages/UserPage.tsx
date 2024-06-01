import React, { useContext, useEffect, useState } from "react";
import { Context } from "../contexts/Context";
import { useNavigate, useParams } from "react-router-dom";
import { updateData } from "../server";

interface User {
  id: string;
  username: string;
  name: string;
  highScore: number;
  score: number;
  wonGames: number;
  matchPlayed: number;
  credit: number;
}

export default function UserPage() {
  const { username = "" } = useParams();
  const context = useContext(Context);
  const navigate = useNavigate();

  const [user, setUser] = useState<User>();
  const [name, setName] = useState("");
  const [credit, setCredit] = useState(0);

  useEffect(() => {
    if (username) {
      const user = context?.allUsers.find(
        (user: User) => user.username === username
      );
      if (!user) {
        alert("User not found");
        navigate("/lobby");
      } else {
        setUser(user);
        setName(user.name);
        setCredit(user.credit);
      }
    }
  }, [username, context?.allUsers, navigate]);

  const edit = () => {
    if (name === "") {
      alert("Name cannot be empty");
      return;
    }

    updateData("users", user?.id, { name, credit }, "User updated", () => {
      context?.setUser({ ...context?.user, name, credit });
      context?.setAllUsers((prev: any) => {
        const index = prev.findIndex(
          (user: any) => user.id === context?.user?.id
        );
        prev[index] = { ...context?.user, name, credit };
        return prev;
      });
      navigate("/lobby");
    });
  };

  if (!context?.user) {
    <div className="text-white flex flex-col gap-10 items-center justify-center w-screen h-screen text-[1.5rem]">
      <p className="text-[1rem]">Loading...</p>
    </div>;
  }

  return (
    <div className="flex flex-col justify-center w-full min-h-screen gap-6 text-black">
      <h1 className="text-[1.2rem] text-white text-center capitalize">{username}' Stats</h1>
      <hr />
      <div className="bg-[#414951] rounded-[10px] p-4 flex flex-col gap-4 w-full">
        <div className="overflow-x-hidden w-full p-4 bg-[#fdf8e3] rounded-[8px] flex flex-col gap-6">
          <ul className="flex flex-col w-full gap-4">
            <li>Username: {user?.username}</li>
            <li className="flex items-center w-full gap-4">
              <p>Name:</p>
              <input
                type="text"
                placeholder="| Name"
                value={name}
                disabled={username !== context?.user?.username}
                onChange={(e) => setName(e.target.value)}
                className="bg-[transparent] w-full px-2 py-1 border-black border-2 rounded-md"
              />
            </li>
            <li>Highest Score: {user?.highScore}</li>
            <li>Average Score: {Math.round((user?.score || 0) / (user?.matchPlayed || 1))}</li>
            <li>Total Score: {user?.score}</li>
            <li>Total Games Won: {user?.wonGames}</li>
            <li>Total Games Played: {user?.matchPlayed}</li>
            <li className="flex items-center gap-4">
              <p>Social Credit:</p>
              <input
                type="number"
                placeholder="| Credit"
                value={credit}
                onChange={(e) => setCredit(parseInt(e.target.value))}
                className="bg-[transparent] w-full px-2 py-1 border-black border-2 rounded-md"
              />
            </li>
          </ul>
          <div className="flex w-full gap-6">
            {
              context?.user?.username === username &&
              <button
                onClick={() => edit()}
                className="w-full small-button bg-[var(--primary)] py-2 rounded-full"
              >
                <p className="w-full text-center text-white">Save</p>
              </button>
            }
            <button
              onClick={() => navigate(-1)}
              className="w-full small-button bg-[var(--blue)] py-2 rounded-full"
            >
              <p className="w-full text-center text-white">Go Back</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
