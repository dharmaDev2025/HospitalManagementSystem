import {
  createContext,
  useState,
  useEffect,
} from "react";

export const AppContext =
  createContext();

function AppProvider({ children }) {

  const [user, setUser] =
    useState(null);



  // Load User After Refresh

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");



    if (storedUser) {

      setUser(
        JSON.parse(storedUser)
      );

    }

  }, []);



  return (

    <AppContext.Provider

      value={{

        user,

        setUser,

      }}

    >

      {children}

    </AppContext.Provider>

  );
}

export default AppProvider;