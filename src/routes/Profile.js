import SetProfile from "components/SetProfile";
import Tweet from "components/Tweet";
import { authService, dbService } from "fbase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styles from "./Profile.module.css";

const Profile = ({ userObj, refreshUser }) => {
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

  const toggleMyTweets = () => setIsShow((prev) => !prev);
  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileEditCtn}>
        <SetProfile userObj={userObj} refreshUser={refreshUser} />
        <button className={styles.logoutButton} onClick={onLogOutClick}>
          로그아웃
        </button>
      </div>

      <div className={styles.myTwittCnt}>
        <button className={styles.toggleMyTweets} onClick={toggleMyTweets}>
          내가 쓴 글 보기
        </button>
        {isShow && (
          <>
            <div className={styles.myTwittZone}>
              {myTweets.map((tweet) => (
                <Tweet
                  key={tweet.id}
                  tweetObj={tweet}
                  isOwner={tweet.creatorId === userObj.uid}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
