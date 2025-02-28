import React, { useState } from "react";
import "./PolicyPopup.css";

interface PolicyPopupProps {
  onClose: () => void;
  policyName: string;
}

const PolicyPopup: React.FC<PolicyPopupProps> = ({ onClose, policyName }) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [query, setQuery] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false); // New state for success message

  // Generate time slots from 9 AM to 5 PM (1-hour slots)
  const timeSlots = [];
  for (let hour = 9; hour <= 17; hour++) {
    const formattedHour = hour <= 12 ? hour : hour - 12;
    const nextHour = hour + 1 <= 12 ? hour + 1 : hour + 1 - 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const nextAmPm = hour + 1 < 12 ? "AM" : "PM";
    timeSlots.push(`${formattedHour}:00 ${amPm} - ${nextHour}:00 ${nextAmPm}`);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!date || !timeSlot) {
      setErrorMessage("Please select both date and time slot.");
      return;
    }

    const appointmentData = {
      name,
      phoneNumber,
      email,
      date,
      timeSlot,
      query,
      policyName,
    };

    console.log("Submitting form data:", appointmentData); // Debug: Log form data

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5001/api/policymeetings/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      const result = await response.json();
      console.log("API response:", result); // Debug: Log API response

      setLoading(false);

      if (response.ok) {
        setIsSubmitted(true); // Set isSubmitted to true on successful submission
        console.log("Form submitted successfully!"); // Debug: Log success
      } else {
        setErrorMessage(result.message || "Error submitting appointment request.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Submission error:", error); // Debug: Log error
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, "").slice(0, 13);
    setPhoneNumber(input);
  };

  return (
    <div className="policy-popup-overlay">
      <div className="policy-popup-container">
        <div className="policy-popup-header">
          <h2>Appointment Scheduling Form</h2>
          <div className="policy-popup-close" onClick={onClose}>
            ×
          </div>
        </div>
        <div className="form-container">
          {isSubmitted ? ( // Conditional rendering for success message
            <div className="success-message">
              <h3>Form Submitted Successfully!</h3>
              <p>Our agent will contact you shortly. Thank you!</p>
              <button className="submit-button" onClick={onClose}>
                Okay
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="appointment-form">
              {errorMessage && <p className="form-error">{errorMessage}</p>}

              <div className="form-field">
                <label htmlFor="name">Name*</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="form-input"
                  placeholder="Enter your name"
                />
              </div>

              <div className="form-field">
                <label htmlFor="phoneNumber">Phone Number*</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  required
                  className="form-input"
                  placeholder="Enter your phone number (WhatsApp)"
                  pattern="\d{10,13}"
                />
              </div>

              <div className="form-field">
                <label htmlFor="email">Email*</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input"
                  placeholder="Enter your email"
                  pattern="[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                  title="Please enter a valid email address (example: name@example.com)"
                />
              </div>

              <div className="form-field">
                <label htmlFor="date">Select a Date*</label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="form-input"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="form-field">
                <label htmlFor="timeSlot">Select a Time Slot*</label>
                <select
                  id="timeSlot"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  required
                  className="form-input"
                >
                  <option value="">-- Select Time --</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="query">Ask your Queries</label>
                <textarea
                  id="query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="form-textarea"
                  placeholder="Ask a question or any specific detail about the policy"
                  rows={4}
                />
              </div>

              <div className="form-field--checkbox">
                <input
                  type="checkbox"
                  id="termsCheckbox"
                  checked={termsAgreed}
                  onChange={() => setTermsAgreed(!termsAgreed)}
                  required
                />
                <label htmlFor="termsCheckbox" className="checkbox-label">
                  I agree to the{" "}
                  <a href="#" className="terms-link">
                    Terms & Conditions
                  </a>
                  .
                </label>
              </div>

              <div className="button-group">
                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PolicyPopup;