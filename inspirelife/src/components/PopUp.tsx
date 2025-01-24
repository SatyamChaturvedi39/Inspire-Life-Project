import React, { useState } from "react";
import "./Popup.css";

interface PopupProps {
  onClose: () => void;
  onSubmit: () => void;
}

const Popup: React.FC<PopupProps> = ({ onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name || !phoneNumber || !email || !termsAgreed) {
      alert(
        "Please fill in all required fields and agree to the Terms & Conditions."
      );
      return;
    }

    console.log("Form submitted:", { name, phoneNumber, email, comment });
    onSubmit(); // Call the onSubmit prop to handle navigation
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-close" onClick={onClose}>
          ×
        </div>
        <form onSubmit={handleSubmit} className="lead-form">
          <h2 className="stayline">Stay Informed:</h2>
          <div className="lead-form__field">
            <label htmlFor="name"></label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="lead-form__input"
              placeholder="Enter your name*"
            />
          </div>
          <div className="lead-form__field">
            <label htmlFor="phoneNumber"></label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="lead-form__input"
              placeholder="Enter your phone number*"
            />
          </div>
          <div className="lead-form__field">
            <label htmlFor="email"></label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="lead-form__input"
              placeholder="Enter your email*"
            />
          </div>
          <div className="lead-form__field">
            <label htmlFor="comment"></label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="lead-form__textarea"
              placeholder="Enter your comment"
            />
          </div>
          <div>
            <input
              type="checkbox"
              id="termsCheckbox"
              checked={termsAgreed}
              onChange={() => setTermsAgreed(!termsAgreed)}
              required
            />
            <label htmlFor="termsCheckbox" className="lead-checkbox">
              I agree to the <a href="#">Terms & Conditions</a>.
            </label>
          </div>
          <div className="lead-button-div">
            <button type="submit" className="lead-form__button">
              SUBMIT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Popup;