import Tweet from "components/Tweet";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";
import TweetFactory from "components/TweetFactory";
import styles from "./Home.module.css";

const Home = ({ userObj }) => {
  const [tweets, setTweets] = useState([]);
  useEffect(() => {
    dbService
      .collection("tweets")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const tweetArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          creator: userObj.displayName,
          ...doc.data(),
        }));
        setTweets(tweetArray);
      });
  }, []);
  return (
    <>
      <div className={styles.homeContainer}>
        <TweetFactory userObj={userObj} />
        <div className={styles.tweetsContainer}>
          {tweets.map((tweet) => (
            <Tweet
              key={tweet.id}
              tweetObj={tweet}
              isOwner={tweet.creatorId === userObj.uid}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
