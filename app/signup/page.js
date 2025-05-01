'use client'
import './signup.css';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usrnmerr, setUsrerr] = useState(null);
  const [passerr, setPasserr] = useState(null);
  const [confirmPassErr, setConfirmPassErr] = useState(null);
  const router = useRouter();
  const validateUsername = (username) => {
    return username.length >= 5 && username.length <= 15;
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };
  const handleSignup = async (e) => {
    e.preventDefault();
  
    setUsrerr(null);
    setPasserr(null);
    setConfirmPassErr(null);
  
    // Log the password for debugging
    console.log("Entered password:", password);
  
    if (!validateUsername(username)) {
      setUsrerr("Username must be between 5 and 15 characters.");
      return;
    }
  
    if (!validatePassword(password)) {
      setPasserr(
        "Password must be at least 8 characters long, and include at least one letter, one number, and one special character."
      );
      return;
    }
  
    if (password !== confirmPassword) {
      setConfirmPassErr("Passwords do not match.");
      return;
    }
  
    try {
      const res = await fetch("/api/Signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          confirmPassword, // Include confirmPassword for complete debugging info
        }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        toast.success("User created successfully! Redirecting to login...", {
          position: "top-center",
        });
        setTimeout(() => router.push("/login"), 3000);
      } else {
        // Log the error response
        console.error("Signup error response:", data);
  
        toast.error(data.message || "Something went wrong. Please try again!", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error during signup:", error);
  
      // Error toast notification for failed signup
      toast.error("Signup failed. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", {
        callbackUrl: "/",
        prompt: "select_account"
      });
    } catch (error) {
      toast.error("Google Sign-In failed", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="theContainer">
      <div className="signup-container">
        <ToastContainer />
        <div className="signup-box">
          <h1 className="signup-title">Sign Up</h1>
          <form onSubmit={handleSignup}>
            <div className="input-group">
              <label className="input-label" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="input-field"
              />
              {usrnmerr ? usrnmerr : " "}
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
                />
              {passerr ? passerr : " "}
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="ConfirmPassword"
                placeholder="Confirm-Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="input-field"
                />
              {confirmPassErr ? confirmPassErr : " "}
            </div>
            <button type="submit" className="submit-button">
              Sign Up
            </button>
          </form>
          <div className="social-signup">
            <button
              type="button"
              className="google-signup-button"
              onClick={handleGoogleSignIn}
            >
              Continue with Google
            </button>
          </div>
          <div className="bottom">
            <p className="bottom-p">
              Already have an account? <a href="/login">Login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
