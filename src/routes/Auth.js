import AuthForm from "components/AuthForm";
import { firebaseInstance, authService } from "fbase";
import React from "react";

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
    <div>
      <div>
        <button name="google" onClick={onSocialClick}>
          Google로 계속하기
        </button>
        <button name="github" onClick={onSocialClick}>
          Github으로 계속하기
        </button>
      </div>
      <div>
        <span>또는</span>
      </div>
      <AuthForm />
    </div>
  );
};
export default Auth;
