import { dbService, storageService } from "fbase";
import { v4 as uuidv4 } from "uuid";
import React, { useRef, useState } from "react";
import styles from "./TweetFactory.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

const TweetFactory = ({ userObj }) => {
  const [tweet, setTweet] = useState("");
  const [attachment, setAttachment] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const onSubmit = async (e) => {
    setIsUploading(true);
    e.preventDefault();
    if (tweet || attachment) {
      try {
        let attachmentUrl = "";
        if (attachment !== "") {
          const attachmentRef = storageService
            .ref()
            .child(`${userObj.uid}/${uuidv4()}`);
          const response = await attachmentRef.putString(
            attachment,
            "data_url"
          );
          attachmentUrl = await response.ref.getDownloadURL();
        }
        const tweetObj = {
          text: tweet,
          createdAt: Date.now(),
          creatorId: userObj.uid,
          creator: userObj.displayName,
          attachmentUrl,
        };
        await dbService.collection("tweets").add(tweetObj);
      } catch (error) {
        console.log("Error adding document: ", error);
      }
      setTweet("");
      setAttachment("");
      fileInput.current.value = null;
    }
    setIsUploading(false);
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setTweet(value);
  };
  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const fileInput = useRef();
  const onClearAttachment = () => {
    setAttachment("");
    fileInput.current.value = null;
  };
  return (
    <form onSubmit={onSubmit} className={styles.tweetFacContainer}>
      <div>
        <div className={styles.photoContainer}>
          <label htmlFor="image_uploads" className={styles.cameraBtn}>
            <div>
              <FontAwesomeIcon icon={faCamera} />
            </div>
          </label>
          {attachment && (
            <div className={styles.previewContainer}>
              <img src={attachment} alt="" width="50px" />
              <button onClick={onClearAttachment}>취소</button>
            </div>
          )}
        </div>
        <textarea
          value={tweet}
          onChange={onChange}
          type="text"
          placeholder="무슨 일이 일어나고 있나요?"
          maxLength={120}
        />
        <input
          className={styles.hideInput}
          id="image_uploads"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInput}
        />
        <div className={styles.tweetBtn}>
          <label htmlFor="tweetBtn">
            {isUploading ? (
              <FontAwesomeIcon icon={faSpinner} spin size="lg" />
            ) : (
              <FontAwesomeIcon icon={faTwitter} size="lg" />
            )}
          </label>
          <input type="submit" id="tweetBtn" />
        </div>
      </div>
    </form>
  );
};

export default TweetFactory;
