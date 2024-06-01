import React, { useContext, useState } from "react";
import LocalMode from "../localMode/Local";
import OnlineMode from "../onlineMode/Online";
import BotMode from "../bot/Bot";
import { useNavigate } from "react-router-dom";
import { Context } from "../contexts/Context";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

function App() {
  const navigate = useNavigate();
  const context = useContext(Context);
  const [mode, setMode] = useState("");

  async function logOut() {
    try {
      await signOut(auth);
      localStorage.clear();
      window.location.href = "/";
    } catch (error) {
      alert("Log out failed.");
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full min-h-screen p-2 z-[1]">
      {mode === "local" ? (
        <LocalMode />
      ) : mode === "online" ? (
        <OnlineMode />
      ) : mode === "bot" ? (
        <BotMode />
      ) : (
        <div className="flex flex-col items-center gap-4 z-[1] relative">
          <h1 className="mb-6 text-2xl font-bold text-white underline underline-offset-4">
            Yazi Game
          </h1>
          <h2 className="text-xl font-bold text-white">Game mode</h2>
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setMode("local")}
              className="w-20 h-10 text-white bg-yellow-500 rounded"
            >
              Local
            </button>
            {/* <button
              onClick={() => setMode("bot")}
              className="w-20 h-10 text-white bg-red-500 rounded"
            >
              Bot
            </button> */}
            <button
              onClick={() => setMode("online")}
              className="w-20 h-10 text-white bg-blue-500 rounded"
            >
              Online
            </button>
          </div>
          <div className="w-full h-1 bg-white"></div>
          <h2 className="text-xl font-bold text-white">My Yazi</h2>
          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/profile/${context?.user?.username}`)}
              className="w-20 h-10 text-white bg-[#4ade80] rounded"
            >
              Profile
            </button>
            <button
              onClick={() => navigate("/games")}
              className="w-20 h-10 text-white bg-[#fb923c] rounded"
            >
              Games
            </button>
            <button
              onClick={() => navigate("/players")}
              className="w-20 h-10 text-white bg-[#34A399] rounded"
            >
              Players
            </button>
          </div>
          <button
            onClick={logOut}
            className="px-4 py-1 mt-20 text-[1rem] rounded-[10px] bg-[var(--white)] !text-black"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
