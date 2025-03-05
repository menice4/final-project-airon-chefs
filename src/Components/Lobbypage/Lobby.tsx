// Create the lobby page where users can see the current users in a room. The host should be able to generate a URL to invite other users to join the room

import { useEffect, useState } from "react";
import { useSocket } from "../../Context/SocketContext.tsx";

interface User {
  id: string;
  name: string;
}

// function to create the lobby component

export default function Lobby() {
  const socket = useSocket();
  const [users, setUsers] = useState<User[]>([]);
  const [room, setRoom] = useState("");
  // allow users to rename themselves
  /*  const [userNames, setUserNames] = useState<string>(""); */

  useEffect(() => {
    if (!socket) return;

    // Listen for updates to the user list
    socket.on("update-users", (users: User[]) => {
      setUsers(users);
    });

    // Clean up the listener when the component unmounts
    return () => {
      socket.off("users");
    };
  }, [socket]);

  /*   const handleJoinRoom = () => {
    if (socket && room) {
      socket.emit("join-room", room);
    }
  }; */

  // Function to generate a URL to invite users to the room
  const handleGenerateInvite = () => {
    const inviteURL = `${window.location.origin}/join?room=${room}`;
    navigator.clipboard.writeText(inviteURL);
    alert("Invite URL copied to clipboard");
  };

  return (
    <div>
      <h1>Lobby</h1>
      <div className="lobby-container">
        <label>Room:</label>
        <input
          type="text"
          id="room-input"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />

        <button onClick={handleGenerateInvite}>Generate Invite URL</button>
      </div>
      <h2>Current Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.id}</li>
        ))}
      </ul>
    </div>
  );
}
