import { authService } from "fbase";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const AuthForm = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");
  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let data;
      if (newAccount) {
        //create account
        data = await authService.createUserWithEmailAndPassword(
          email,
          password
        );
        history.push("/createAccount");
      } else {
        //log in
        data = await authService.signInWithEmailAndPassword(email, password);
      }
      console.log(data);
    } catch (error) {
      if (
        error.message ===
        "Firebase: The email address is already in use by another account. (auth/email-already-in-use)."
      ) {
        setError("이미 가입한 이메일 입니다.");
      } else if (
        error.message ===
        "Firebase: The password is invalid or the user does not have a password. (auth/wrong-password)."
      ) {
        setError("비밀번호가 틀렸습니다.");
      } else if (
        error.message ===
        "Firebase: There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found)."
      ) {
        setError("해당 아이디를 찾을 수 없습니다.");
      } else if (email === "") {
        setError("이메일을 입력해주세요.");
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        setError("이메일 형식이 잘못되었습니다.");
      } else if (password.length < 6) {
        setError("비밀번호를 6글자 이상 입력해주세요.");
      } else {
        setError(error.message);
      }
    }
  };
  const toggleAccount = () => {
    setNewAccount((prev) => !prev);
    setError("");
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="text"
          placeholder="Email"
          value={email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={onChange}
        />
        <input type="submit" value={newAccount ? "계정 만들기" : "로그인"} />
        {error}
      </form>
      <span>{newAccount ? "이미 계정이 있으신가요? " : ""}</span>
      <span onClick={toggleAccount}>
        {newAccount ? "로그인하기" : "계정 만들기"}
      </span>
    </>
  );
};

export default AuthForm;
