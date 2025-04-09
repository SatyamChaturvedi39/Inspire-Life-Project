import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LeadFormPopUp.css";
import TermsAndConditionsPopup from "./TermsAndConditions";

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
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = { name, phoneNumber, email, comment };

    try {
      setLoading(true);

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        onSubmit();
        if (selectedAction) {
          navigate(`/${selectedAction}`);
        }
      } else {
        setErrorMessage(result.message || "Error submitting form.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Submission error:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleSkip = () => {
    onClose();
    if (selectedAction) {
      navigate(`/${selectedAction}`);
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, "").slice(0, 10);
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
          {errorMessage && <p className="form-error">{errorMessage}</p>}
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
              pattern="\d{10}"
              inputMode="numeric"
              title="Please enter exactly 10 digits"
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) e.preventDefault();
              }}
            />
          </div>
          <div className="lead-form__field">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="lead-form__input"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="lead-form__field">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="lead-form__textarea"
              placeholder="Ask a query"
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
              I agree to the{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowTermsPopup(true);
                }}
              >
                Terms &amp; Conditions
              </a>.
            </label>
          </div>
          <div className="lead-button-div">
            <button type="submit" className="lead-form__button" disabled={loading}>
              {loading ? "Submitting..." : "SUBMIT"}
            </button>
            <button type="button" className="lead-form__button" onClick={handleSkip}>
              SKIP
            </button>
          </div>
        </form>
      </div>
      {showTermsPopup && (
        <TermsAndConditionsPopup
          onAccept={() => {
            setTermsAgreed(true);
            setShowTermsPopup(false);
          }}
          onDecline={() => {
            setTermsAgreed(false);
            setShowTermsPopup(false);
          }}
        />
      )}
    </div>
  );
};

export default Popup;
