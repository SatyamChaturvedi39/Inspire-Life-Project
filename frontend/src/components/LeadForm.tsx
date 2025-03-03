import React, { useState } from "react";
import "./LeadForm.css";

const LeadForm: React.FC = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState<string>(""); // Stores "green" or "red"

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = { name, phoneNumber, email, comment };

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5001/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        setMessage("Form submitted successfully!");
        setMessageColor("green");
        setName("");
        setPhoneNumber("");
        setEmail("");
        setComment("");
        setTermsAgreed(false);
      } else {
        setMessage(result.message || "Error submitting form.");
        setMessageColor("red");
      }
    } catch (error) {
      setLoading(false);
      console.error("Submission error:", error);
      setMessage("Something went wrong. Please try again.");
      setMessageColor("red");
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, "").slice(0, 13);
    setPhoneNumber(input);
  };

  return (
    <div className="lead-form-container">
      <form onSubmit={handleSubmit} className="lead-form">
        <h2 className="stayline">Stay Informed:</h2>
        {message && (
          <p className="form-message" style={{ color: messageColor, fontWeight: "bold" }}>
            {message}
          </p>
        )}
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
          <button
            type="submit"
            className="lead-form__button"
            disabled={loading}
          >
            {loading ? "Submitting..." : "SUBMIT"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeadForm;