import {
  faPen,
  faTrashCan,
  faCheck,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
    <div className={styles.tweetContainer}>
      {editing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit} className={styles.textBox}>
                <div className={styles.confirmCancelBtn}>
                  <div>
                    <label htmlFor="confirm">
                      <FontAwesomeIcon icon={faCheck} />
                    </label>
                  </div>
                  <input id="confirm" type="submit" value="수정" />
                  <button className={styles.cancelBtn} onClick={toggleEditing}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                </div>
                <textarea
                  onChange={onChange}
                  placeholder="트윗 수정하기!"
                  type="text"
                  value={newTweet}
                  required
                />
              </form>
            </>
          )}
        </>
      ) : (
        <>
          <div className={styles.textBox}>
            {isOwner && (
              <>
                <div className={styles.editDeleteBtn}>
                  <button onClick={toggleEditing}>
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button onClick={onDeleteClick}>
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </div>
              </>
            )}
            {tweetObj.attachmentUrl && (
              <div className={styles.imgContainer}>
                <img
                  alt=""
                  className={styles.uploadImg}
                  src={tweetObj.attachmentUrl}
                />
              </div>
            )}
            <h4 className={styles.tweet}>{tweetObj.text.replace()}</h4>
            <div className={styles.tweetInfo}>
              <span>{`작성자: ${tweetObj.creator}`}</span>
              <Times tweetObj={tweetObj} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Tweet;
