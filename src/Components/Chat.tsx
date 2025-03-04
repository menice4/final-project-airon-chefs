import React, { useState, useEffect } from "react";
// import socket io client
import io from "socket.io-client";

// Create a socket connection
const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("Connected to server with id: ", socket.id);
});

export default function Chat() {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // Listen for messages from the server
  // This isn't good, as listener is being set up every time the chat component renders, causing multiple listeners to be added
  // We should set up the listener inside a useEffect hook to ensure it only runs once when the component mounts
  useEffect(() => {
    socket.on("receive-message", (msg: string) => {
      console.log("Received message: ", msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Clean up the listener when the component unmounts
    return () => {
      socket.off("receive-message");
    };
  });

  // Add a message to the chat
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages((prevMessages) => [...prevMessages, message]);
      setMessage("");

      // Emit the message to the server
      // Event name must match on server side and client side. Payload is message state
      socket.emit("message", message);
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
