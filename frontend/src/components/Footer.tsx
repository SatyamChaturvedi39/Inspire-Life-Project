import React from "react";
import "./Footer.css"; // Add styles here
import logo from "../assets/logo.png";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-header">
          <div className="LogoCompany">
          <img src={logo} alt="Inspire Life Logo" className="footer-logo" />
          <div className="footer-Company">
            <h5>Inspire Life Insurance Solutions</h5>
            <p>Jayanagar, Bengaluru</p>            
          </div>
          </div>
          <div className="Site-map">
            <div className="map">
              <div className="gmap_canvas">
                <iframe
                  className="gmap_iframe"
                  width={200} // Changed to number
                  frameBorder={0} // Changed to number
                  scrolling="no"
                  marginHeight={0} // Changed to number
                  marginWidth={0} // Changed to number
                  src="https://maps.google.com/maps?width=578&amp;height=400&amp;hl=en&amp;q=715, 22nd Cross Rd, K.R.Road, Banashankari Stage II, Banashankari, Bengaluru, Karnataka 560070&amp;t=&amp;z=17&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
        <hr className="Line"></hr>
        <div className="footer-columns">
          <div className="footer-column">
            <h4>
              <b>Company</b>
            </h4>
            <ul>
              <li>About us</li>
              <li>Policies</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>
              <b>Services</b>
            </h4>
            <ul>
              <li>Renewals</li>
              <li>Self Service</li>
            </ul>
          </div>
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
                  width={200} // Changed to number
                  frameBorder={0} // Changed to number
                  scrolling="no"
                  marginHeight={0} // Changed to number
                  marginWidth={0} // Changed to number
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
    </footer>
  );
};

export default Footer;
