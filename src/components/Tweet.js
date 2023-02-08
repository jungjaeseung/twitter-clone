import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import Times from "./Times";
import styles from "./Tweet.module.css";

const Tweet = ({ tweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("이 트윗을 정말 삭제하실건가요?");
    if (ok) {
      await dbService.doc(`tweets/${tweetObj.id}`).delete();
      if (tweetObj.attachmentUrl !== "") {
        await storageService.refFromURL(`${tweetObj.attachmentUrl}`).delete();
      }
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (e) => {
    e.preventDefault();
    await dbService
      .doc(`tweets/${tweetObj.id}`)
      .update({ text: newTweet, createdAt: Date.now() });
    setEditing(false);
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewTweet(value);
  };
  return (
    <div>
      {editing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit}>
                <textarea
                  onChange={onChange}
                  placeholder="트윗 수정하기!"
                  type="text"
                  value={newTweet}
                  required
                />
                <input type="submit" value="수정" />
              </form>
              <button onClick={toggleEditing}>취소</button>
            </>
          )}
        </>
      ) : (
        <>
          <h4 className={styles.tweet}>{tweetObj.text.replace()}</h4>
          <span>{`작성자: ${tweetObj.creator}`}</span>
          <Times tweetObj={tweetObj} />
          {tweetObj.attachmentUrl && (
            <img src={tweetObj.attachmentUrl} width="50px" height="50px" />
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>삭제하기</button>
              <button onClick={toggleEditing}>수정하기</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Tweet;
