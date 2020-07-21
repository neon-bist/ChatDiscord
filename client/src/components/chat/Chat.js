import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Socket from "../utilis/Socket";
import Messages from "../messages/Messages";
import InputContainer from "../input/Input";
import "./chat.css";

let socket;
const Chat = () => {
  const [messages, setmessages] = useState([]);
  const [text, settext] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);

    const name = queryParams.get("name").trim();

    const room = queryParams.get("room").trim();

    socket = Socket();

    socket.emit("joinRoom", { name, room });

    socket.on("message", (msg) => {
      setmessages((messages) => messages.concat(msg));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();

    if (text.trim().length === 0) {
      return;
    }
    socket.emit("chatMessage", text.trim());
    settext("");
    ref.current.focus();
  };

  const ref = useRef();
  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>
          <i className="fas fa-smile"></i> ChatCord
        </h1>
        <Link to="/" className="btn">
          Leave Romm
        </Link>
      </header>
      <main className="chat-main">
        <div className="chat-sidebar">
          <h3>
            <i className="fas fa-comments"></i> Room Name:
          </h3>
          <h2 id="room-name">JavaScript</h2>
          <h3>
            <i className="fas fa-users"></i> Users
          </h3>
          <ul id="users">
            <li>Brad</li>
            <li>John</li>
            <li>Mary</li>
            <li>Paul</li>
            <li>Mike</li>
          </ul>
        </div>
        <Messages messages={messages} />
      </main>
      <InputContainer
        sendMessage={sendMessage}
        onchange={(e) => settext(e.target.value)}
        text={text}
        ref={ref}
      />
    </div>
  );
};

export default Chat;