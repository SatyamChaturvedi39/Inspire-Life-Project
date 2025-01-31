import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const NavBar = () => {
  const location = useLocation();

  return (
    <nav>
      <ul>
        <li className="first-child">
          <Link
            to="/"
            className={location.pathname === "/" ? "active" : ""}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/about"
            className={location.pathname === "/about" ? "active" : ""}
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
        <li className="last-child">
          <Link
            to="/contact"
            className={location.pathname === "/contact" ? "active" : ""}
          >
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;