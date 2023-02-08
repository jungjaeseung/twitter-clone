import { dbService } from "fbase";
import React from "react";
import styles from "./Times.module.css";

const Times = ({ tweetObj }) => {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return (
    <div className={styles.time}>
      <span>{`${new Date(tweetObj.createdAt).getFullYear()}.`}</span>
      <span>{`${new Date(tweetObj.createdAt).getMonth() + 1}.`}</span>
      <span>{`${new Date(tweetObj.createdAt).getDate()}. `}</span>
      <span>{`${new Date(tweetObj.createdAt).getHours()}시`}</span>
      <span>{`${new Date(tweetObj.createdAt).getMinutes()}분`}</span>
      <span>{`${new Date(tweetObj.createdAt).getSeconds()}초 `}</span>
      <span>{`${days[`${new Date(tweetObj.createdAt).getDay()}`]}요일`}</span>
    </div>
  );
};

export default Times;
