import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Popup.css";

interface PopupProps {
  onClose: () => void;
  onSubmit: () => void;
  selectedAction: "policies" | "careers" | null;
}

const Popup: React.FC<PopupProps> = ({ onClose, onSubmit, selectedAction }) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name || !phoneNumber || !email || !termsAgreed) {
      alert("Please fill in all required fields and agree to the Terms & Conditions.");
      return;
    }

    console.log("Form submitted:", { name, phoneNumber, email, comment });
    onSubmit();
    if (selectedAction) {
      navigate(`/${selectedAction}`);
    }
  };

  const handleSkip = () => {
    onClose();
    if (selectedAction) {
      navigate(`/${selectedAction}`);
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '').slice(0, 13);
    setPhoneNumber(input);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2 className="stayline">Stay Informed:</h2>
          <div className="popup-close" onClick={onClose}>
            ×
          </div>
        </div>
        <form onSubmit={handleSubmit} className="lead-form">
          <div className="lead-form__field">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="lead-form__input"
              placeholder="Enter your name*"
            />
          </div>
          <div className="lead-form__field">
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              required
              className="lead-form__input"
              placeholder="Enter your phone number*"
              pattern="\d{10,13}"
            />
          </div>
          <div className="lead-form__field">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="lead-form__input"
              placeholder="Enter your email"
            />
          </div>
          <div className="lead-form__field">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="lead-form__textarea"
              placeholder="Add a comment"
            />
          </div>
          <div className="lead-form__field--checkbox">
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
            <button type="button" className="lead-form__button" onClick={handleSkip}>
              SKIP
            </button>
            
          </div>
        </form>
      </div>
    </div>
  );
};

export default Popup;