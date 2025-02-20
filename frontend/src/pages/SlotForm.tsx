import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./slotform.css";

// Importing the header image
import slotImage from "../assets/slotimage.jpg";

const SlotForm: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState<string>("");

  const timeSlots = [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "01:00 PM - 02:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
  ];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedDate || !selectedTime) {
      setMessage("Please select a date and time slot.");
      setMessageColor("red");
      return;
    }

    const formData = {
      date: selectedDate.toISOString().split("T")[0],
      timeSlot: selectedTime,
    };

    try {
      setLoading(true);
      console.log("formdata", formData);
      console.log("json hmhmhmmm ", JSON.stringify(formData));
      const response = await fetch("http://localhost:5001/api/slots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        setMessage("Slot booked successfully!");
        setMessageColor("green");
        setSelectedDate(null);
        setSelectedTime("");
      } else {
        setMessage(result.message || "Error booking slot.");
        setMessageColor("red");
      }
    } catch (error) {
      setLoading(false);
      console.error("Submission error:", error);
      setMessage("Something went wrong. Please try again.");
      setMessageColor("red");
    }
  };

  return (
    <div className="slot-form-container">
      {/* Header image with full width */}
      <div
        className="slot-header-image"
        style={{
          backgroundImage: `url(${slotImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "40vh",
          borderRadius: "10px 10px 0 0",
        }}
      ></div>

      <form onSubmit={handleSubmit} className="slot-form">
        <h2>Book a Slot</h2>
        {message && (
          <p
            className="form-message"
            style={{ color: messageColor, fontWeight: "bold" }}
          >
            {message}
          </p>
        )}

        {/* Form Fields Container */}
        <div className="slot-form-fields-container">
          <div className="slot-form__field">
            <label>Name:</label>
            <input
              type="text"
              className="slot-form__input"
              placeholder="Enter your name"
            />
          </div>

          <div className="slot-form__field">
            <label>Phone Number:</label>
            <input
              type="text"
              className="slot-form__input"
              placeholder="Enter your phone number"
            />
          </div>

          <div className="slot-form__field">
            <label>Email:</label>
            <input
              type="email"
              className="slot-form__input"
              placeholder="Enter your email"
            />
          </div>

          <div className="slot-form__field">
            <label>Comments:</label>
            <textarea
              className="slot-form__textarea"
              placeholder="Any additional comments?"
            ></textarea>
          </div>
        </div>

        {/* Date Picker */}
        <div className="slot-form__field">
          <label>Select a Date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
            dateFormat="yyyy-MM-dd"
            className="slot-form__input"
            placeholderText="Choose a date"
          />
        </div>

        {/* Time Slot Selector */}
        <div className="slot-form__field">
          <label>Select a Time Slot:</label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="slot-form__input"
          >
            <option value="">Select a time slot</option>
            {timeSlots.map((slot, index) => (
              <option key={index} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="slot-button-div">
          <button
            type="submit"
            className="slot-form__button"
            disabled={loading}
          >
            {loading ? "Booking..." : "BOOK SLOT"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SlotForm;
