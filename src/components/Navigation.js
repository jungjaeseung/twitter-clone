import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Navigation.module.css";

const Navigation = ({ userObj }) => {
  return (
    <nav>
      <ul className={styles.menuContainer}>
        <li>
          <Link to="/">홈</Link>
        </li>
        <li>
          <Link to="/profile">{`${userObj.displayName}의 프로필`}</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
