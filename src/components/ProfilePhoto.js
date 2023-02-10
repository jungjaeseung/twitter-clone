import React from "react";

const ProfilePhoto = (tweetObj) => {
  return <img src={tweetObj.photoURL} />;
};

export default ProfilePhoto;
