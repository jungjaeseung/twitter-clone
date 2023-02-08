import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          photoUrl: user.photoURL,
          updateProfile: (args) => user.updateProfile(args),
        });
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      photoUrl: user.photoURL,
      updateProfile: (args) => user.updateProfile(args),
    });
  };
  return (
    <div>
      <>
        {init ? (
          <AppRouter
            refreshUser={refreshUser}
            userObj={userObj}
            isLoggedIn={Boolean(userObj)}
          />
        ) : (
          "Initializing..."
        )}
        {/* <footer>&copy; {new Date().getFullYear()} 3harang Twitter </footer> */}
      </>
    </div>
  );
}

export default App;
