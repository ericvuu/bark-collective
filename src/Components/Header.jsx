import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Logo from "../assets/Images/logo-white.svg";

const Header = ({ actionButtonView }) => {
  const { user, logout } = useAuth();
  let navigate = useNavigate();
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHidden, setIsHidden] = useState(false);

  const handleAuthAction = async () => {
    if (user) {
      await logout();
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <nav className={`header ${isHidden ? "hidden" : ""}`}>
      <Link className="header-brand" to="/">
        <img alt="Bark Collective Logo" className="logo" src={Logo} />
      </Link>
      {actionButtonView && (
        <ul className="header-nav">
          <li className="nav-item">
            <button className="login" onClick={handleAuthAction}>
              {user ? "Log Out" : "Adopt"}
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Header;
