import React, { useState } from "react";
import "./Careers.css";
import careersImage from "../assets/careersImage.jpg";
import bookslot from "../assets/bookslot.png";
import SlotForm from "../components/SlotForm";
import { useAuth } from "../context/AuthContext"; // Assuming you have this context

const Careers: React.FC = () => {
  const [showSlotForm, setShowSlotForm] = useState(false);
  const { id: adminId } = useAuth();

  const handleShowSlotForm = () => {
    setShowSlotForm(true);
  };

  const handleCloseSlotForm = () => {
    setShowSlotForm(false);
  };

  return (
    <div className="careers-container">
      <div className="careers-hero-image-container">
        <img
          src={careersImage}
          alt="Join Our Team"
          className="careers-hero-image"
          style={{ cursor: "pointer" }}
          onClick={handleShowSlotForm}
        />
      </div>

      <section className="careers-content">
        <div className="careers-header">
          <h2>Why Join Us?</h2>
          <button className="book-slot" onClick={handleShowSlotForm}>
            <img src={bookslot} alt="Book a Slot" className="book-slot-image" />
          </button>
        </div>

        <div className="benefits-card">
          <p>🚀 Career Growth & Development</p>
          <p>💡 Make a Real Impact</p>
          <p>💰 Competitive Pay & Benefits</p>
          <p>🌍 Inclusive & Supportive Culture</p>
          <p>⚖️ Work-Life Balance</p>
          <p>🏆 Employee Recognition & Rewards</p>
        </div>

        <div className="join-us">
          <h3>Become Part of Our Growing Team and Maximize Your Earnings!</h3>
          <p>
            We’re seeking motivated individuals to join our network and
            contribute to our success. Interested in becoming an agent?
          </p>
          <p>
            Send your resume to{" "}
            <a href="mailto:inspirelife@gmail.com">inspirelife@gmail.com</a> or
            reach out to us at <a href="tel:+917026262632">+91 7026262632</a>.
          </p>
        </div>
      </section>

      {showSlotForm && (
        <SlotForm
          meetingType="career"
          onClose={handleCloseSlotForm}
          notifyTelegram={true}
          ownerId={adminId ?? undefined} // Convert null to undefined.ownerId={adminId}
        />
      )}
    </div>
  );
};

export default Careers;
