import "./Careers.css";
import careersImage from "../assets/careersImage.jpg";
import bookslot from "../assets/bookslot.png";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

const Careers = () => {
  const navigate = useNavigate(); // Initialize navigation function

  return (
    <div className="careers-container">
      {/* Clickable Hero Image for Navigation */}
      <div className="careers-hero-image-container">
        <Link to="/slotform">
          <img
            src={careersImage}
            alt="Join Our Team"
            className="careers-hero-image"
            style={{ cursor: "pointer" }}
          />
        </Link>
      </div>

      <section className="careers-content">
        <div className="careers-header">
          <h2>Why Join Us?</h2>

          {/* Button Redirects to SlotForm Page */}
          <button
            className="book-slot"
            onClick={() => navigate("/slotform")} // Ensure navigation works
          >
            <img src={bookslot} alt="Book a Slot" className="book-slot-image" />
          </button>
        </div>

        {/* Benefits Section */}
        <div className="benefits-card">
          <p>🚀 Career Growth & Development</p>
          <p>💡 Make a Real Impact</p>
          <p>💰 Competitive Pay & Benefits</p>
          <p>🌍 Inclusive & Supportive Culture</p>
          <p>⚖️ Work-Life Balance</p>
          <p>🏆 Employee Recognition & Rewards</p>
        </div>

        {/* Join Us Section */}
        <div className="join-us">
          <h3>Become Part of Our Growing Team and Maximize Your Earnings!</h3>
          <p>
            We’re seeking motivated individuals to join our network and
            contribute to our success. Interested in becoming an agent?
          </p>
          <p>
            Send your resume to{" "}
            <a href="mailto:inspirelife@gmail.com">inspirelife@gmail.com</a> or
            reach out to us at
            <a href="tel:+919876543210"> +91 9876543210</a>.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Careers;
