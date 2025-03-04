import React, { useState } from "react";
// import socket io client
import io from "socket.io-client";

// Create a socket connection
const socket = io("http://localhost:5000");

export default function Chat() {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // Add a message to the chat
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages((prevMessages) => [...prevMessages, message]);
      setMessage("");
    }
  };

  // Join a chat room
  const handleJoinRoom = () => {
    console.log("Joining room: ", room);
  };

  return (
    <div className="chat-container">
      <form onSubmit={handleSendMessage} className="chat-form">
        <label htmlFor="message-input">Message</label>
        <input
          type="text"
          id="message-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" id="send-button">
          Send
        </button>
        <label htmlFor="room-input">Room</label>
        <input
          type="text"
          id="room-input"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button type="button" id="room-button" onClick={handleJoinRoom}>
          Join
        </button>
      </form>
      <div className="chatbox">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
}
