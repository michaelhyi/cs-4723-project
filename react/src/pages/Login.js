import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import googleLogo from "../assets/google-logo.png";
import githubLogo from "../assets/github-logo.png";
import AuthHttpClient from "../http/AuthHttpClient";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Handler for email/password login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      AuthHttpClient.login(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Login failed: " + error.message);
    }
  };

  // Handler for Google login
  const handleGoogleLogin = async () => {
    // const provider = new GoogleAuthProvider();
    try {
    //   await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error logging in with Google:", error);
      alert("Google Login failed: " + error.message);
    }
  };

  // Handler for GitHub login
  const handleGithubLogin = async () => {
    // const provider = new GithubAuthProvider();
    try {
    //   await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error logging in with GitHub:", error);
      alert("GitHub Login failed: " + error.message);
    }
  };

  return (
    <div className="auth-container">
      <h1>APIVeil</h1>
      <h2>Login To Your Account</h2>
      <form className="auth-form" onSubmit={handleLogin}>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="forgot-password">
          <a href="#" className="forgot-password-link">
            Forgot Password?
          </a>
        </div>

        <button type="submit" className="btn-primary">
          Login
        </button>

        <div className="or-separator">
          <span>OR</span>
        </div>

        <button 
          type="button" 
          className="btn-social google-login" 
          onClick={handleGoogleLogin}
        >
          <img src={googleLogo} alt="Google" />
          Login with Google
        </button>

        <button 
          type="button" 
          className="btn-social github-login"
          onClick={handleGithubLogin}
        >
          <img src={githubLogo} alt="GitHub" />
          Login with GitHub
        </button>

        <div className="register-link">
          Don't have an account? <a href="/register">Register</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
