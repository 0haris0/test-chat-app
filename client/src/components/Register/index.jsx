// @ts-check
import { Toast } from "react-bootstrap";
import React, { useState, useRef } from "react";
import Logo from "../Logo";
import "./style.css";
import { useEffect } from "react";

const DEMO_USERS = ["Pablo", "Joe", "Mary", "Alex"];

export default function Login({ onLogIn }) {
  const [username, setUsername] = useState(
    () => DEMO_USERS[Math.floor(Math.random() * DEMO_USERS.length)]
  );
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    onLogIn(username, password, setError);
  };

  return (
    <>
      <div className={"register"}>
        <div>Registration</div>
      </div>
    </>
  );
}

const UsernameSelect = ({ username, setUsername, names = [""] }) => {
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(0);
  const ref = useRef();
  /** @ts-ignore */
  const clientRectWidth = ref.current?.getBoundingClientRect().width;
  useEffect(() => {
    /** @ts-ignore */
    setWidth(clientRectWidth);
  }, [clientRectWidth]);

  /** Click away listener */
  useEffect(() => {
    if (open) {
      const listener = () => setOpen(false);
      document.addEventListener("click", listener);
      return () => document.removeEventListener("click", listener);
    }
  }, [open]);

  /** Make the current div focused */
  useEffect(() => {
    if (open) {
      /** @ts-ignore */
      ref.current?.focus();
    }
  }, [open]);

  return (
    <div
      tabIndex={0}
      ref={ref}
      className={`username-select-dropdown ${open ? "open" : ""}`}
      onClick={() => setOpen((o) => !o)}
    >
      <div className="username-select-row">
        <div>{username}</div>
        <div>
          <svg width={24} height={24}>
            <path d="M7 10l5 5 5-5z" fill="#333" />
          </svg>
        </div>
      </div>
      <div
        style={{ width: width }}
        className={`username-select-block ${open ? "open" : ""}`}
      >
        {names.map((name) => (
          <div
            className="username-select-block-item"
            key={name}
            onClick={() => setUsername(name)}
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
};
