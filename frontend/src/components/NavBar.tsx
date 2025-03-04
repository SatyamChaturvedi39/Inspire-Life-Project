import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { accessToken, clearAuth } = useAuth();

  const isPolicyPage = location.pathname.startsWith('/policies/');

  const handleLogout = async () => {
    try {
      // Call the backend logout endpoint to clear the refresh token cookie.
      await fetch("http://localhost:5001/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error during logout", error);
    } finally {
      // Immediately clear the in-memory auth state.
      clearAuth();
      navigate("/login");
    }
  };


  return (
    <nav>
      <ul>
        <li className="first-child">
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/about-us" className={location.pathname === "/about-us" ? "active" : ""}>
            About Us
          </Link>
        </li>
        <li>
          <Link
            to="/policies"
            className={location.pathname === "/policies" || isPolicyPage ? "active" : ""}
          >
            Policies
          </Link>
        </li>
        <li>
          <Link to="/careers" className={location.pathname === "/careers" ? "active" : ""}>
            Careers
          </Link>
        </li>
        <li>
          <Link to="/contact" className={location.pathname === "/contact" ? "active" : ""}>
            Contact
          </Link>
        </li>
        {accessToken ? (
          <>
            <li>
              <Link
                to="/dashboard/admin"
                className={location.pathname.startsWith("/dashboard/admin") ? "active" : ""}
              >
                Dashboard
              </Link>
            </li>
            <li className="logout-link">
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <li className="login-link">
            <Link
              to="/login"
              className={location.pathname.startsWith("/login") ? "active" : ""}
            >
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
