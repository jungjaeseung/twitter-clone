import { useState } from "react";
import { useHistory } from "react-router-dom";
import styles from "./SetName.module.css";

const SetName = ({ userObj, refreshUser }) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState("");
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewDisplayName(value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    await userObj.updateProfile({
      displayName: newDisplayName,
    });
    await refreshUser();
    history.push("/");
  };
  return (
    <div className={`${styles.setName_container} main_container`}>
      <span>프로필 이름 설정</span>
      <form onSubmit={onSubmit} className={styles.form_container}>
        <input
          onChange={onChange}
          type="text"
          placeholder="이름"
          value={newDisplayName}
          required
        />
        <input type="submit" value="가입" />
      </form>
    </div>
  );
};

export default SetName;
