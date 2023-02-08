import { dbService, storageService } from "fbase";
import { v4 as uuidv4 } from "uuid";
import React, { useRef, useState } from "react";

const TweetFactory = ({ userObj }) => {
  const [tweet, setTweet] = useState("");
  const [attachment, setAttachment] = useState("");
  const onSubmit = async (e) => {
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
    <form onSubmit={onSubmit}>
      <input
        value={tweet}
        onChange={onChange}
        type="text"
        placeholder="무슨 일이 일어나고 있나요?"
        maxLength={120}
      />
      <label htmlFor="image_uploads">사진 추가</label>
      <input
        id="image_uploads"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        ref={fileInput}
      />
      <input type="submit" value="트윗" />
      {attachment && (
        <div>
          <img src={attachment} width="50px" height="50px" />
          <button onClick={onClearAttachment}>취소</button>
        </div>
      )}
    </form>
  );
};

export default TweetFactory;
