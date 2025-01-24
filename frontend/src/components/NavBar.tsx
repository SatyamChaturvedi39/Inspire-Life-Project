import "./Navbar.css";

const NavBar = () => {
  return (
    <nav>
      <ul>
        <li>
          <a
            href="/"
            className={window.location.pathname === "/" ? "active" : ""}
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="/about"
            className={window.location.pathname === "/about" ? "active" : ""}
          >
            About Us
          </a>
        </li>
        <li>
          <a
            href="/policies"
            className={window.location.pathname === "/policies" ? "active" : ""}
          >
            Policies
          </a>
        </li>
        <li>
          <a
            href="/careers"
            className={window.location.pathname === "/careers" ? "active" : ""}
          >
            Careers
          </a>
        </li>
        <li>
          <a
            href="/contact"
            className={window.location.pathname === "/contact" ? "active" : ""}
          >
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
