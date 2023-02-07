import { dbService } from "fbase";
import React, { useState } from "react";

const Tweet = ({ tweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this tweet?");
    if (ok) {
      await dbService.doc(`tweets/${tweetObj.id}`).delete();
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (e) => {
    e.preventDefault();
    await dbService.doc(`tweets/${tweetObj.id}`).update({ text: newTweet });
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
          <form onSubmit={onSubmit}>
            <input
              onChange={onChange}
              placeholder="Edit your tweet"
              type="text"
              value={newTweet}
              required
            />
            <input type="submit" value="Update Tweet" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{tweetObj.text}</h4>
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Tweet</button>
              <button onClick={toggleEditing}>Edit Tweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Tweet;
