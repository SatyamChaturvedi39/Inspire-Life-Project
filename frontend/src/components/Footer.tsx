import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Footer.css";
import logo from "../assets/logo.png";
import PopUp from "./LeadFormPopup"; // Using PopUp.tsx

const Footer: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  // Function to handle page navigation and scroll
  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Function to open popup and navigate to home first
  const openPopup = (title: string) => {
    setPopupTitle(title);
    setShowPopup(true);
    handleNavigation("/"); // Navigate to home first
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-header">
          <div className="LogoCompany">
            <Link to="/" onClick={() => handleNavigation("/")}>
              <img src={logo} alt="Inspire Life Logo" className="footer-logo" />
            </Link>
            <div className="footer-Company">
              <h5>
                <Link to="/" className="footer-link" onClick={() => handleNavigation("/")}>
                  Inspire Life Insurance Solutions
                </Link>
              </h5>
              <p>Jayanagar, Bengaluru</p>
              <br />
              <p>Address:<address>715, 22nd Cross Rd, K.R.Road,<br /> Banashankari Stage II, Banashankari,<br /> Bengaluru, Karnataka 560070</address></p>
              <p>Email: InspireLife@gmail.com</p>
            </div>
            </div>
          <div className="Site-map">
            <div className="map">
              <div className="gmap_canvas">
                <iframe
                  className="gmap_iframe"
                  width={200}
                  frameBorder={0}
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src="https://maps.google.com/maps?width=578&amp;height=400&amp;hl=en&amp;q=715, 22nd Cross Rd, K.R.Road, Banashankari Stage II, Banashankari, Bengaluru, Karnataka 560070&amp;t=&amp;z=17&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        <hr className="Line"></hr>

        <div className="footer-columns">
          {/* Website Links */}
          <div className="footer-column">
            <h4>
              <b>Website</b>
            </h4>
            <ul>
              <li><a href="#" onClick={() => handleNavigation("/about-us")} className="footer-link">About Us</a></li>
              <li><a href="#" onClick={() => handleNavigation("/policies")} className="footer-link">Policies</a></li>
              <li><a href="#" onClick={() => handleNavigation("/careers")} className="footer-link">Careers</a></li>
              <li><a href="#" onClick={() => handleNavigation("/contact")} className="footer-link">Contact</a></li>
            </ul>
          </div>

          {/* Services Section with Popups */}
          <div className="footer-column">
            <h4>
              <b>Services</b>
            </h4>
            <ul>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); openPopup("Become an Agent"); }} className="footer-link">
                  Become an Agent
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); openPopup("Buy Policies"); }} className="footer-link">
                  Buy Policies
                </a>
              </li>
              <li>Renew policies</li>
            </ul>
          </div>

          {/* Group Companies */}
          <div className="footer-column">
            <h4>
              <b>Group Companies</b>
            </h4>
            <ul>
              <li>Lic</li>
              <li>Star Health</li>
              <li>Care Health</li>
            </ul>
          </div>

        </div>

        <div className="footer-column">
          <div className="Site-map2">
            <div className="map2">
              <div className="gmap_canvas">
                <iframe
                  className="gmap_iframe"
                  width={200}
                  frameBorder={0}
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src="https://maps.google.com/maps?width=578&amp;height=400&amp;hl=en&amp;q=715, 22nd Cross Rd, K.R.Road, Banashankari Stage II, Banashankari, Bengaluru, Karnataka 560070&amp;t=&amp;z=17&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                ></iframe>
              </div>
            </div>
          </div>

          <style>
            {`
          .mapouter {
            position: relative;
            text-align: left;
            width: 100%;
            height: 150px;
          }
          .gmap_canvas {
            overflow: hidden;
            background: none !important;
            width: 100%;
            height: 150px;
          }
          .gmap_iframe {
            height: 150px !important;
          }
        `}
          </style>
        </div>
        

        <hr className="Line1"></hr>

        <div className="footer-CR">
          <p>&#169; {new Date().getFullYear()}. All Rights Reserved.</p>
        </div>
      </div>

      {/* Popup Component */}
      {showPopup && <PopUp title={popupTitle} onClose={() => setShowPopup(false)} />}
    </footer>
  );
};

export default Footer;
