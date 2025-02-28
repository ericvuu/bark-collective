import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import Header from "../Components/Header";
import ColumnImage from "../assets/Images/Login/login.jpg";

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  let navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      setErrorMessage("Both fields are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(formData.name, formData.email);
      navigate("/search");
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("Error logging in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="login-container">
        <div className="image-side">
          <img src={ColumnImage} alt="Login Illustration" />
        </div>
        <div className="form-side">
          <div className="form-wrapper">
            <h2>Login</h2>
            <p>
              If this is your first time, you can still use the form below by
              entering your username and email to proceed.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Username</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </form>
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
