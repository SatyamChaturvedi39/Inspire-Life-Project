import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const NavBar = () => {
  const location = useLocation();

  return (
    <nav>
      <ul>
        <li className="first-child">
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/about-us"
            className={location.pathname === "/about-us" ? "active" : ""}
          >
            About Us
          </Link>
        </li>
        <li>
          <Link
            to="/policies"
            className={location.pathname === "/policies" ? "active" : ""}
          >
            Policies
          </Link>
        </li>
        <li>
          <Link
            to="/careers"
            className={location.pathname === "/careers" ? "active" : ""}
          >
            Careers
          </Link>
        </li>
        <li>
          <Link
            to="/contact"
            className={location.pathname === "/contact" ? "active" : ""}
          >
            Contact
          </Link>
        </li>
<<<<<<< Updated upstream
        {/* Login Page Link */}
        <li className="login-link">
          <Link
            to="/login"
            className={location.pathname.startsWith("/login") ? "active" : ""}
          >
            Login
=======
        {/* Admin Dashboard Link */}
        <li className="admin-link">
          <Link
            to="/admin"
            className={location.pathname.startsWith("/admin") ? "active" : ""}
          >
            Admin
>>>>>>> Stashed changes
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
