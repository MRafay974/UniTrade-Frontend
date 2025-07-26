import { useState } from "react";
import { handleError, handleSuccess } from "../NavBar/utils";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./login.css";
import { BACKEND_BASE_URL } from "../../apiInstances/baseurl";
import { FaEnvelope, FaLock, FaSignInAlt, FaGraduationCap, FaSpinner } from 'react-icons/fa';


export default function SignupPage() {
  const navigate = useNavigate();

  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false); // ✅ Added loading state

  function handleChange(e) {
    const { name, value } = e.target;
    const copySignupInfo = { ...signupInfo };
    copySignupInfo[name] = value;
    setSignupInfo(copySignupInfo);
  }

  async function handleSignup(e) {
    e.preventDefault();
    const { name, email, password, phone } = signupInfo;
    if (!name || !email || !password || !phone) {
      return handleError("Name, email, password, and phone number are required");
    }

    setLoading(true); // ✅ Show spinner

    try {
      const url = `${BACKEND_BASE_URL}/auth/signup`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupInfo),
      });
      console.log("Response:", response);

      const result = await response.json();
      const { success, message, error } = result;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else if (!success) {
        handleError(message);
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      }
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false); // ✅ Hide spinner
    }
  }

  return (
    <div className="login-container">
      <div className="screen">
        <div className="screen__content">
          <form className="login" onSubmit={handleSignup}>
            <div className="login__field">
              <label className="label">Name</label>
              <i className="login__icon fas fa-user"></i>
              <input
                name="name"
                type="text"
                className="login__input"
                placeholder="Enter your name"
                value={signupInfo.name}
                onChange={handleChange}
              />
            </div>
            <div className="login__field">
              <label className="label">Email</label>
              <i className="login__icon fas fa-envelope"></i>
              <input
                name="email"
                type="text"
                className="login__input"
                placeholder="Enter your email"
                value={signupInfo.email}
                onChange={handleChange}
              />
            </div>
            <div className="login__field">
              <label className="label">Password</label>
              <i className="login__icon fas fa-lock"></i>
              <input
                name="password"
                type="password"
                className="login__input"
                placeholder="Enter your password"
                value={signupInfo.password}
                onChange={handleChange}
              />
            </div>
            <div className="login__field">
              <label className="label">Phone Number</label>
              <i className="login__icon fas fa-phone"></i>
              <input
                name="phone"
                type="text"
                className="login__input"
                placeholder="Enter your phone number"
                value={signupInfo.phone}
                onChange={handleChange}
              />
            </div>

            {/* ✅ Updated Button */}
            <button className="button login__submit" type="submit" disabled={loading}>
              {loading ? (
                <>
                    <FaSpinner className="spin-icon" />
                  <span className="button__text"> Signing Up...</span>
                </>
              ) : (
                <>
                  <span className="button__text">Sign Up Now</span>
                  <i className="button__icon fas fa-chevron-right"></i>
                </>
              )}
            </button>
          </form>

          <div className="registration-link">
            <p>Already have an account?</p>
            <Link to="/login" className="signup-link">
              Login here
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
