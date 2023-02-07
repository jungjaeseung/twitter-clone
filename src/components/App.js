import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj(user);
      }
      setInit(true);
    });
  }, []);
  return (
    <div>
      <>
        {init ? (
          <AppRouter userObj={userObj} isLoggedIn={Boolean(userObj)} />
        ) : (
          "Initializing..."
        )}
        <footer>&copy; {new Date().getFullYear()} 3harang Twitter </footer>
      </>
    </div>
  );
}

export default App;
