import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { auth, db } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Context } from "./contexts/Context";
import { signOut } from "firebase/auth";

import NotFound from "./pages/NotFound";
import SignUp from "./auth/SignUp";
import Login from "./auth/Login";
import Main from "./pages/Main";
import Profile from "./pages/UserPage";
import Players from "./pages/Players";
import Games from "./pages/Games";

function App() {
  const context = useContext(Context);

  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setIsLogged(!!user);
      if (user) {
        const userInfo = await fetchUserInfo();
        if (!userInfo) {
          return alert("Usuário não encontrado.");
        }
        context?.setUser({
          ...userInfo,
          id: userInfo.email,
        });
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setIsLogged(false);
      }
    });
    return () => unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUserInfo = async () => {
    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      where("username", "==", auth?.currentUser?.email?.split("@")[0])
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const userDoc = querySnapshot.docs[0];
    const user = userDoc.data();
    return user;
  };

  async function logOut() {
    try {
      await signOut(auth);
      localStorage.clear();
      window.location.href = "/";
    } catch (error) {
      alert("Log out failed.");
    }
  }

  if (isLoading || context?.isLoading) {
    return (
      <div className="text-white flex flex-col gap-10 items-center justify-center w-screen h-screen text-[1.5rem]">
        <p className="text-[1rem]">Loading...</p>
        <button
          onClick={logOut}
          className="px-4 py-1 text-[1rem] rounded-[10px] bg-[var(--white)] !text-black"
        >
          Log Out
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full min-h-screen z-[1]">
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path={"/register"} element={<SignUp />} />
          {isLogged && <Route path={"/lobby"} element={<Main />} />}
          {isLogged && <Route path={"/profile/:username"} element={<Profile />} />}
          {isLogged && <Route path={"/players"} element={<Players />} />}
          {isLogged && <Route path={"/games"} element={<Games />} />}
          <Route path={"*"} element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
