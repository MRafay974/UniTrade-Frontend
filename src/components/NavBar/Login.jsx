import { handleError, handleSuccess } from "./utils";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { FaEnvelope, FaLock, FaSignInAlt, FaGraduationCap, FaSpinner } from 'react-icons/fa';
import "./login.css";
import { BACKEND_BASE_URL } from "../../apiInstances/baseurl";

export default function LoginPage() {
  const navigate = useNavigate();

  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false); // ✅ Added loading state

  function handleChange(e) {
    const { name, value } = e.target;
    const copyLoginInfo = { ...loginInfo };
    copyLoginInfo[name] = value;
    setLoginInfo(copyLoginInfo);
  }

  async function handleLogin(e) {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError("Email and password are required");
    }

    setLoading(true); // ✅ Start loading

    try {
      const url = `${BACKEND_BASE_URL}/auth/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo),
      });

      console.log(loginInfo)

      const result = await response.json();
      const { success, message, jwtTokenn, name, error } = result;

      if (success) {
        handleSuccess(message);
        localStorage.setItem("Token", jwtTokenn);
        localStorage.setItem("UserLoggedIn", name);
        localStorage.setItem("UserEmail", email);
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  }

  return (
    <div className="login-container">
      <div className="background-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <div className="screen">
        <div className="screen__content">
          <div className="welcome-header">
            <FaGraduationCap className="university-icon" />
            <h1 className="page-title">University Marketplace</h1>
            <p className="welcome-text">Welcome back! Please login to continue</p>
          </div>

          <form className="login" onSubmit={handleLogin}>
            <div className="login__field">
              <FaEnvelope className="field-icon" />
              <input
                name="email"
                type="email"
                className="login__input"
                placeholder="Enter your email"
                value={loginInfo.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="login__field">
              <FaLock className="field-icon" />
              <input
                name="password"
                type="password"
                className="login__input"
                placeholder="Enter your password"
                value={loginInfo.password}
                onChange={handleChange}
                required
              />
            </div>
            <button className="login__submit" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <FaSpinner className="spin-icon" /> Logging in...
                </>
              ) : (
                <>
                  <span>Login Now</span>
                  <FaSignInAlt />
                </>
              )}
            </button>
          </form>

          <div className="registration-link">
            <p>
              New to University Marketplace?{" "}
            </p>
            <Link to="/signup" className="signup-link">
              Create an account
            </Link>
          </div>
        </div>

        <div className="screen__background">
          <span className="screen__background__shape screen__background__shape4"></span>
          <span className="screen__background__shape screen__background__shape3"></span>
          <span className="screen__background__shape screen__background__shape2"></span>
          <span className="screen__background__shape screen__background__shape1"></span>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
