import React from "react";
import "./Footer.css"; // Add styles here
import logo from '../assets/logo.png'

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-header">
          <img
            src={logo} 
            alt="Inspire Life Logo"
            className="footer-logo"
          />
          <h3>Inspire Life Insurance Solutions</h3>
          <p>Jayanagar, Bengaluru</p>
        </div>
        <div className="footer-columns">
          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li>About us</li>
              <li>Policies</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Services</h4>
            <ul>
              <li>Renewals</li>
              <li>Self Service</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Group Companies</h4>
            <ul>
              <li>Lic</li>
              <li>Star Health</li>
              <li>Care Health</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
