import Tweet from "components/Tweet";
import { authService, dbService } from "fbase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styles from "./Profile.module.css";

const Profile = ({ userObj, refreshUser }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [myTweets, setMyTweets] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const history = useHistory();
  const onLogOutClick = () => {
    // 로그아웃하고 초기페이지로 가도록 수정해야함
    authService.signOut();
    history.push("/");
  };
  const getMyTweets = () => {
    dbService
      .collection("tweets")
      .where("creatorId", "==", userObj.uid)
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const myDbTweetsArr = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMyTweets(myDbTweetsArr);
      });
  };
  useEffect(() => {
    getMyTweets();
  }, []);
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewDisplayName(value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(newDisplayName.length);
    if (newDisplayName.length > 8) {
      alert("8글자 아래로 설정해주세요.");
      return;
    }
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      refreshUser();
      let idArr = [];
      let valueArr = [];
      let newArr = [];
      await dbService
        .collection("tweets")
        .where("creatorId", "==", userObj.uid)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            idArr.push(doc.id);
            valueArr.push(doc.data());
          });
        });
      newArr = valueArr.map((item) => ({ ...item, creator: newDisplayName }));
      idArr.map((id, index) => {
        dbService.collection("tweets").doc(id).set(newArr[index]);
      });
    }
  };
  const toggleMyTweets = () => setIsShow((prev) => !prev);
  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileEditCtn}>
        <form onSubmit={onSubmit} className={styles.profileEditForm}>
          <span>프로필 관리</span>
          <input
            className={styles.editNameInput}
            onChange={onChange}
            type="text"
            placeholder="Display name"
            value={newDisplayName}
          />
          <input
            className={styles.confirmInput}
            type="submit"
            value="이름 변경하기"
          />
        </form>
        <button className={styles.logoutButton} onClick={onLogOutClick}>
          로그아웃
        </button>
      </div>

      <div className={styles.myTwittCnt}>
        <button className={styles.toggleMyTweets} onClick={toggleMyTweets}>
          내가 쓴 글 보기
        </button>
        {isShow &&
          myTweets.map((tweet) => (
            <Tweet
              key={tweet.id}
              tweetObj={tweet}
              isOwner={tweet.creatorId === userObj.uid}
            />
          ))}
      </div>
    </div>
  );
};

export default Profile;
