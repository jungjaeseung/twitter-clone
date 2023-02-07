import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  return (
    <div>
      <>
        {init ? (
          <AppRouter userObj={userObj} isLoggedIn={isLoggedIn} />
        ) : (
          "Initializing..."
        )}
        <footer>&copy; {new Date().getFullYear()} 3harang Twitter </footer>
      </>
    </div>
  );
}

export default App;
