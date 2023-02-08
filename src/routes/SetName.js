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
        placeholder="Set your name!"
        value={newDisplayName}
      />
      <input type="submit" value="Start" />
    </form>
  );
};

export default SetName;
