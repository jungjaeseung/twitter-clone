import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";
import styles from "./App.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          photoURL: user.photoURL,
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
    <div className={styles.appContainer}>
      <>
        {init ? (
          <AppRouter
            refreshUser={refreshUser}
            userObj={userObj}
            isLoggedIn={Boolean(userObj)}
          />
        ) : (
          <FontAwesomeIcon icon={faSpinner} spin />
        )}
        {/* <footer>&copy; {new Date().getFullYear()} 3harang Twitter </footer> */}
      </>
    </div>
  );
}

export default App;
