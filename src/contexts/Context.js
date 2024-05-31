import React, { createContext, useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState(null);

  // Users
  const [allUsers, setAllUsers] = useState(null);
  // Games
  const [games, setGames] = useState([]);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);

        // Users
        let allUsers = await getDocs(collection(db, 'users'));
        let allUserDocs = allUsers.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAllUsers(allUserDocs);
        // Games
        let allGames = await getDocs(collection(db, 'games'));
        let allProjectDocs = allGames.docs.map((doc) => ({ id: doc.id, ...doc.data()}));
        setGames(allProjectDocs);

        setIsLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    if (user && user?.type !== "inactive") {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  return (
    <Context.Provider value={{
      user, setUser,
      games, setGames,
      allUsers, setAllUsers,
      isLoading
    }}>
      {children}
    </Context.Provider>
  );
};
