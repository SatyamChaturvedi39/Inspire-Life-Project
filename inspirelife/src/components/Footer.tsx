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
          <div className="footer-Company">
          <h5>Inspire Life Insurance Solutions</h5>
          <p>Jayanagar, Bengaluru</p>
          </div>
        </div>
        <div className="footer-columns">
          <div className="footer-column">
            <h4><b>Company</b></h4>
            <ul>
              <li>About us</li>
              <li>Policies</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4><b>Services</b></h4>
            <ul>
              <li>Renewals</li>
              <li>Self Service</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4><b>Group Companies</b></h4>
            <ul>
              <li>Lic</li>
              <li>Star Health</li>
              <li>Care Health</li>
            </ul>
          </div>
        </div>
        <div className="sitemap">
          <h4>Sitemap</h4>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/home">Home</a></li>
            <li><a href="/careers">Careers</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        <hr></hr>
        <div className="footer-CR">
        <p>&#169; {new Date().getFullYear()}. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;