import { authService, dbService, storageService } from "fbase";
import React, { useRef, useState } from "react";
import styles from "./SetProfile.module.css";

const SetProfile = ({ userObj, refreshUser }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [attachment, setAttachment] = useState("");
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewDisplayName(value);
  };
  const fileInput = useRef();
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
  const onSetPhoto = async () => {
    try {
      let attachmentUrl = "";
      if (attachment !== "") {
        const attachmentRef = storageService
          .ref()
          .child(`${userObj.uid}/profilePhoto`);
        const response = await attachmentRef.putString(attachment, "data_url");
        attachmentUrl = await response.ref.getDownloadURL();
        console.log("attachmentUrl: ", attachmentUrl);
        await userObj
          .updateProfile({
            photoURL: attachmentUrl,
          })
          .then(() => {
            console.log("useObj.photoUrl: ", userObj.photoURL);
          })
          .catch((error) => {
            console.log("error photo : ", error);
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
        newArr = valueArr.map((item) => ({ ...item, photoURL: attachmentUrl }));
        idArr.map((id, index) => {
          dbService.collection("tweets").doc(id).set(newArr[index]);
        });
      } else {
        await userObj
          .updateProfile({
            photoURL:
              "https://firebasestorage.googleapis.com/v0/b/twitter-clone-39b48.appspot.com/o/defaultProfilePhoto%2FdefaultPhoto.png?alt=media&token=d3823e4f-8428-4f43-9557-282bb648962a",
          })
          .then(() => {
            console.log("useObj.photoUrl: ", userObj.photoURL);
          })
          .catch((error) => {
            console.log("error photo : ", error);
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
        newArr = valueArr.map((item) => ({
          ...item,
          photoURL:
            "https://firebasestorage.googleapis.com/v0/b/twitter-clone-39b48.appspot.com/o/defaultProfilePhoto%2FdefaultPhoto.png?alt=media&token=d3823e4f-8428-4f43-9557-282bb648962a",
        }));
        idArr.map((id, index) => {
          dbService.collection("tweets").doc(id).set(newArr[index]);
        });
      }
    } catch (error) {
      console.log("Error adding document: ", error);
    }
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      if (newDisplayName.length > 8) {
        alert("8글자 아래로 설정해주세요.");
        return;
      }
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
  return (
    <form onSubmit={onSubmit} className={styles.profileEditForm}>
      <span>프로필 관리</span>
      <div className={styles.setProfileCnt}>
        <div className={styles.setProfileWithBtnCnt}>
          <input
            className={styles.editNameInput}
            onChange={onChange}
            type="text"
            placeholder="Display name"
            value={newDisplayName}
          />
          <input
            className={styles.confirmInput}
            type="submit"
            value="이름변경"
          />
        </div>
        <div className={styles.setProfileWithBtnCnt}>
          <label htmlFor="profile_upload">
            <div className={styles.profileUploadCnt}>
              {attachment ? (
                <img src={attachment} alt="" className={styles.previewPhoto} />
              ) : (
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/twitter-clone-39b48.appspot.com/o/defaultProfilePhoto%2FdefaultPhoto.png?alt=media&token=d3823e4f-8428-4f43-9557-282bb648962a"
                  className={styles.previewPhoto}
                />
              )}
            </div>
          </label>
          <input
            className={styles.profilePhotoInput}
            onChange={onFileChange}
            type="file"
            id="profile_upload"
            accept="image/*"
            ref={fileInput}
          />
          <button onClick={onSetPhoto} className={styles.confirmInput}>
            사진변경
          </button>
        </div>
      </div>
    </form>
  );
};

export default SetProfile;
