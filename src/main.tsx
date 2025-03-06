import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import React from "react";
// Import the socketProvider from context and wrap the App component in it
import { SocketProvider } from "./Context/SocketContext.tsx";
import { BrowserRouter as Router } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SocketProvider>
      <Router>
        <App />
      </Router>
    </SocketProvider>
  </React.StrictMode>
);
