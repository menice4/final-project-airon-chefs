import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";

const LoginPage = () => {
  const authContext = useContext(AuthContext);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingGithub, setLoadingGithub] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { googleSignIn, githubSignIn } = authContext;

  const handleGoogleSignIn = async () => {
    setLoadingGoogle(true);
    setError(null);
    const { error } = await googleSignIn();
    setLoadingGoogle(false);
    if (error) {
      setError("Google login failed. Please try again.");
      console.error(error);
    }
  };

  const handleGithubSignIn = async () => {
    setLoadingGithub(true);
    setError(null);
    const { error } = await githubSignIn();
    setLoadingGithub(false);
    if (error) {
      setError("GitHub login failed. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="login-page">
      <h2>Welcome to the Quiz App</h2>
      <p>Sign in to start playing!</p>
      {error && <p className="error">{error}</p>}
      <div className="login-buttons">
        <button
          onClick={handleGoogleSignIn}
          disabled={loadingGoogle || loadingGithub}
          className="google-btn"
          aria-label="Sign in with Google"
        >
          {loadingGoogle ? "Logging in..." : "Sign in with Google"}
        </button>
        <button
          onClick={handleGithubSignIn}
          disabled={loadingGoogle || loadingGithub}
          className="github-btn"
          aria-label="Sign in with GitHub"
        >
          {loadingGithub ? "Logging in..." : "Sign in with GitHub"}
        </button>
      </div>
      <Link to="/home">Go to Home</Link>
    </div>
  );
};

export default LoginPage;
