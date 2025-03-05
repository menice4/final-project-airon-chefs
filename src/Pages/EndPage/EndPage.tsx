import { Link } from "react-router-dom";

function EndPage() {
  return (
    <div>
      <h1>Quiz Complete</h1>
      <p>Thank you for playing</p>
      <Link to="/home">Go back to Home</Link>
    </div>
  );
}

export default EndPage;
