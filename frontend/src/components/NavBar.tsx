import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./NavBar.css";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { accessToken, role, clearAuth } = useAuth();

  const isPolicyPage = location.pathname.startsWith("/policies/");

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error during logout", error);
    } finally {
      clearAuth();
      navigate("/login");
    }
  };

  // Determine dashboard path based on user role
  const dashboardPath = role === "admin" ? "/dashboard/admin" : "/dashboard/agent";

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
                to={dashboardPath}
                className={location.pathname.startsWith(dashboardPath) ? "active" : ""}
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
            <Link to="/login" className={location.pathname.startsWith("/login") ? "active" : ""}>
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;