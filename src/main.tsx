import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
// Import the socketProvider from context and wrap the App component in it
import { SocketProvider } from "./Context/SocketContext.tsx";

createRoot(document.getElementById("root")!).render(
  <SocketProvider>
    <App />
  </SocketProvider>
);
