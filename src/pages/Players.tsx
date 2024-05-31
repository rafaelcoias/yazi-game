import React, { useContext } from "react";
import { Context } from "../contexts/Context";
import { useNavigate } from "react-router-dom";

export default function Players() {
  interface User {
    id: string;
    username: string;
    name: string;
    highScore: number;
    score: number;
    wonGames: number;
    matchPlayed: number;
    credit: number;
    [key: string]: any;
  }

  const context = useContext(Context);
  const navigate = useNavigate();

  const keys = [
    {
      key: "highScore",
      title: "Highest Score",
    },
    {
      key: "score",
      title: "Total Score",
    },
    {
      key: "wonGames",
      title: "Total Games Won",
    },
    {
      key: "matchPlayed",
      title: "Total Match Played",
    },
    {
      key: "credit",
      title: "Social Credit",
    },
  ];

  function getHighest(key: string): User[] {
    const users = context?.allUsers;
    if (!users) return [];
    const sortedUsers = users.sort((a: User, b: User) => b[key] - a[key]);
    console.log(sortedUsers)
    if (sortedUsers.length < 3) {
      for (let i = sortedUsers.length; i < 3; i++) {
        sortedUsers.push({ name: "No user", [key]: 0 });
      }
    }
    return sortedUsers;
  }

  function Stats({title, users, status}: {title: string, users: User[], status:string}) {
    return (
      <div className="flex flex-col gap-4 border-b-2 pb-8 border-[#414951]">
        <p>{title}</p>
        <div className="flex justify-center gap-6">
          <div className="flex flex-col items-center justify-end gap-2">
            <p>{users[1]?.name || "No Name"}</p>
            <div className=" bg-[#c5cad1] text-[white] flex justify-center items-center p-1 w-12 h-10 aspect-square rounded-md text-[1.4rem]">
              2★
            </div>
            <p>{users[1][status] || "0"}</p>
          </div>
          <div className="flex flex-col items-center justify-end gap-2">
            <p>{users[0]?.name || "No Name"}</p>
            <div className=" bg-[#e4c358] text-[white] flex justify-center items-center p-1 w-12 aspect-square rounded-md text-[1.4rem]">
              1★
            </div>
            <p>{users[0][status] || "0"}</p>
          </div>
          <div className="flex flex-col items-center justify-end gap-2">
            <p>{users[2]?.name || "No Name"}</p>
            <div className=" bg-[#c38368] text-[white] flex justify-center items-center p-1 w-12 h-8 aspect-square rounded-md text-[1.4rem]">
              3★
            </div>
            <p>{users[2][status] || "0"}</p>
          </div>
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
      <h1 className="text-[1.2rem] text-white text-center">Players</h1>
      <hr />
      <div className="bg-[#414951] rounded-[10px] p-4 flex flex-col gap-4 w-full">
        <div className="overflow-x-auto w-full p-4 bg-[#fdf8e3] rounded-[8px] flex flex-col gap-6">
          <h1 className="text-[1.2rem] text-black text-center">
            Players Stats
          </h1>

          {
            keys && keys.length !== 0 ? keys.map((ele:any, index:number) => {
            return (
                <Stats title={ele?.title} users={getHighest(ele?.key)} status={ele?.key} />
              )
            }) :
            <p className='w-full text-center'>No result</p>
          }

          <h1 className="text-[1.2rem] text-black text-center">Players List</h1>
          <div className="grid w-full grid-cols-3 gap-4">
            {context?.allUsers && context?.allUsers.length !== 0 ? (
              context?.allUsers.map((ele: any, index: number) => {
                return (
                  <button
                    onClick={() => navigate(`/profile/${ele?.username}`)}
                    key={index}
                    className="p-2 text-white bg-red-500 rounded-md"
                  >
                    {ele?.name}
                  </button>
                );
              })
            ) : (
              <p className="w-full text-center">Nenhum resultado</p>
            )}
          </div>
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
