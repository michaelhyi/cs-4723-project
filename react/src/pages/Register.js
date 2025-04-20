import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import googleLogo from "../assets/google-logo.png";
import githubLogo from "../assets/github-logo.png";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
    //   await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Registration failed: " + error.message);
    }
  };

  return (
    <div className="auth-container">
      <h1>APIVeil</h1>
      <h2>Create Your Account</h2>
      <form className="auth-form" onSubmit={handleRegister}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
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

        <button type="submit" className="btn-primary">
          Register
        </button>

        <div className="or-separator">
          <span>OR</span>
        </div>

        <button type="button" className="btn-social google-login">
          <img src={googleLogo} alt="Google" />
          Register with Google
        </button>
        <button type="button" className="btn-social github-login">
          <img src={githubLogo} alt="GitHub" />
          Register with GitHub
        </button>

        <div className="register-link">
          Already have an account? <Link to="/">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
