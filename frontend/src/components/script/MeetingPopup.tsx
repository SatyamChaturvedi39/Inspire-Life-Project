import React, { useState } from "react";
import "../css/MeetingPopup.css";

interface MeetingPopupProps {
  onClose: () => void;
  meetingType: "client" | "applicant";
  policyName?: string;
}

const MeetingPopup: React.FC<MeetingPopupProps> = ({ onClose, meetingType, policyName }) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [query, setQuery] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setMonth(maxDate.getMonth() + 1);
  const maxDateString = maxDate.toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !timeSlot) {
      setErrorMessage("Please select both date and time slot.");
      return;
    }
    if (phoneNumber.length !== 10) {
      setErrorMessage("Phone number must be exactly 10 digits.");
      return;
    }

    const meetingData = {
      meetingType,
      name,
      phoneNumber,
      email,
      date,
      timeSlot,
      query,
      policyName: meetingType === "client" ? policyName : undefined,
      agentId: "agent1", // Replace with dynamic agent ID if needed
    };

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5001/api/meetings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(meetingData),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Error submitting meeting.");
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, "").slice(0, 10); // Limit to 10 digits
    setPhoneNumber(input);
  };
  return (
    <div className="meeting-popup-overlay">
      <div className="meeting-popup-container">
        <div className="meeting-popup-header">
          <h2>Booking Form</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="form-container">
          {isSubmitted ? (
            <div className="success-message">
              <h3>Form submitted successfully!</h3>
              <p>Our agent will contact you shortly. Thank you!</p>
              <button className="submit-button" onClick={onClose}>
                  Okay
                </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="meeting-form">
              {errorMessage && <p className="error-message">{errorMessage}</p>}
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
                  placeholder="Enter your phone number(WhatsApp)"
                  pattern="\d{10}"
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
                  title="Please enter a valid email address (example: name@gmail.com)"
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
                  min={today.toISOString().split("T")[0]}
                  max={maxDateString}
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
                  <option value="">Select a time slot</option>
                  <option value="9:00 AM - 10:00 AM">9:00 AM - 10:00 AM</option>
                  <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                  <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                  <option value="1:00 PM - 2:00 PM">12:00 AM - 1:00 PM</option>
                  <option value="2:00 PM - 3:00 PM">2:00 PM - 3:00 PM</option>
                  <option value="3:00 PM - 4:00 PM">3:00 PM - 4:00 PM</option>
                  <option value="4:00 PM - 5:00 PM">4:00 PM - 5:00 PM</option>
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="query">Query</label>
                <textarea
                  id="query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="form-textarea"
                  placeholder="Ask your queries"
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
              <button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          )}
        </div>  
      </div>
    </div>
  );
};

export default MeetingPopup;