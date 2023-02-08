import {
  faGithub,
  faGoogle,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthForm from "components/AuthForm";
import { firebaseInstance, authService } from "fbase";
import React from "react";
import styles from "./Auth.module.css";

const Auth = () => {
  const onSocialClick = async (e) => {
    const {
      target: { name },
    } = e;
    let provider;
    if (name === "google") {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else if (name === "github") {
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }
    await authService.signInWithPopup(provider);
  };

  return (
    <div className={`${styles.auth_container} main_container`}>
      <div>
        <FontAwesomeIcon icon={faTwitter} size="5x" />
      </div>
      <div>
        <div className={styles.extLoginCtn}>
          <button name="google" onClick={onSocialClick}>
            <FontAwesomeIcon icon={faGoogle} size="xl" />
            {` Google로 계속하기`}
          </button>
          <button name="github" onClick={onSocialClick}>
            <FontAwesomeIcon icon={faGithub} size="xl" />
            {` Github으로 계속하기`}
          </button>
        </div>
        <div className={styles.horLine}>
          <span>또는</span>
        </div>
        <AuthForm />
      </div>
    </div>
  );
};
export default Auth;
