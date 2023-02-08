import { useState } from "react";
import { useHistory } from "react-router-dom";

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
    <form onSubmit={onSubmit}>
      <input
        onChange={onChange}
        type="text"
        placeholder="프로필 이름을 설정해주세요."
        value={newDisplayName}
      />
      <input type="submit" value="가입" />
    </form>
  );
};

export default SetName;
