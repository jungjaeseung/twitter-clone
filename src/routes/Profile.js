import Tweet from "components/Tweet";
import { authService, dbService } from "fbase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

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
    <>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          placeholder="Display name"
          value={newDisplayName}
        />
        <input type="submit" value="이름 변경하기" />
      </form>
      <button onClick={onLogOutClick}>로그아웃</button>
      <div>
        <button onClick={toggleMyTweets}>내가 쓴 글 보기</button>
        {isShow &&
          myTweets.map((tweet) => (
            <Tweet
              key={tweet.id}
              tweetObj={tweet}
              isOwner={tweet.creatorId === userObj.uid}
            />
          ))}
      </div>
    </>
  );
};

export default Profile;
