import "./Header.css";
import logo from "../assets/logo.png";

const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <img
          src={logo}
          alt="Inspire Life Insurance Solutions"
          className="logo"
        />
      </div>
      <div className="header-text">
        <h1>Inspire Life Insurance Solutions</h1>
        <p>Jayanagar, Bengaluru</p>
      </div>
    </header>
  );
};

export default Header;