import React, { useContext } from "react";
import { Context } from "../contexts/Context";
import { useNavigate } from "react-router-dom";

export default function Games() {
  interface User {
    id: string;
    username: string;
    name: string;
    score: number;
    color: string;
    [key: string]: any;
  }

  const context = useContext(Context);
  const navigate = useNavigate();

  function Game({ date, users }: { date: string; users: User[] }) {
    return (
      <div className="flex flex-col gap-4 border-2 p-8 border-[#414951] rounded-lg">
        <p className="text-center text-[black]">{date}</p>
        <div className="flex gap-4">
          {users
            .sort((a: User, b: User) => b?.score - a?.score)
            .map((user: User, index: number) => {
              const height = `${(users.length - index) * 1.5}rem  `;
              return (
                <div className="flex flex-col items-center justify-end gap-1">
                  <div style={{height: height}} className={`w-4 bg-[${user?.color}]`}></div>
                  <p className="w-full text-center border-t-2">{user?.score}</p>
                  <p>{user?.name}</p>
                </div>
              );
            })}
        </div>
      </div>
    );
  }

  if (!context?.allUsers) {
    <div className="text-white flex flex-col gap-10 items-center justify-center w-screen h-screen text-[1.5rem]">
      <p className="text-[1rem]">Loading...</p>
    </div>;
  }

  return (
    <div className="flex flex-col py-[2rem] w-full min-h-screen gap-6 text-black">
      <h1 className="text-[1.2rem] text-white text-center">Games History</h1>
      <hr />
      <div className="bg-[#414951] rounded-[10px] p-4 flex flex-col gap-4 w-full">
        <div className="overflow-x-auto w-full p-4 bg-[#fdf8e3] rounded-[8px] flex flex-col gap-6">
          {context?.games && context?.games.length !== 0 ? (
            context?.games.map((ele: any, index: number) => {
              return <Game date={ele?.date} users={ele?.players} />;
            })
          ) : (
            <p className="w-full text-center">No result</p>
          )}

          <div className="flex w-full gap-6">
            <button
              onClick={() => navigate("/lobby")}
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
