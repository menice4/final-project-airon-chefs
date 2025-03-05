// Create the lobby page where users can see the current users in a room. The host should be able to generate a URL to invite other users to join the room

import { useEffect, useState } from "react";
import { useSocket } from "../../Context/SocketContext.tsx";
import Chat from "../../Components/Chat/ChatInterface.tsx";

// React router to allow navigation to other pages
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  name: string;
}

// function to create the lobby component
export default function Lobby() {
  const socket = useSocket();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  // allow users to rename themselves
  const [userNames, setUserNames] = useState<string>("");
  // check if username is set
  const [isUserNameSet, setIsUserNameSet] = useState<boolean>(false);

  useEffect(() => {
    if (!socket) return;

    // Listen for updates to the user list
    socket.on("update-users", (users: User[]) => {
      setUsers(users);
    });

    // Listens for the start game event
    socket.on("start-game", () => {
      navigate("/game");
    });

    // Clean up the listener when the component unmounts
    return () => {
      socket.off("users");
    };
  }, [socket]);

  // function to allow users to rename
  const handleRename = () => {
    if (userNames.trim() && socket) {
      socket.emit("rename-user", userNames);
      setIsUserNameSet(true);
    }
  };

  // Function to generate a URL to invite users to the room
  const handleGenerateInvite = () => {
    const inviteURL = `${window.location.origin}/quiz-lobby`;
    navigator.clipboard.writeText(inviteURL);
    alert("Invite link copied to clipboard");
  };

  return (
    <div>
      {/* ternary operator conditionally rendering a different UI based on whether a new user has set their name or not */}
      <h1>Lobby</h1>
      {!isUserNameSet ? (
        <div>
          <label htmlFor="name-input">Enter your name:</label>
          <input
            type="text"
            id="name-input"
            value={userNames}
            onChange={(e) => setUserNames(e.target.value)}
          />
          <button onClick={handleRename}>Set Name</button>
        </div>
      ) : (
        <div>
          <div className="lobby-container">
            <button onClick={handleGenerateInvite}>Generate Invite URL</button>
          </div>
          <h2>Current Users</h2>
          <ul>
            {users.map((user) => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
          <Chat />
        </div>
      )}
    </div>
  );
}
