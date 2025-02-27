import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./SlotForm.css";
import slotImage from "../assets/slotimage.jpg";

const SlotForm: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState<string>("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]); // ✅ Track booked slots

  const timeSlots = [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 01:00 PM",
    "01:00 PM - 02:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
  ];

  // ✅ Convert date to IST format (YYYY-MM-DD)
  const convertToIST = (date: Date) => {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is GMT+5:30
    const istDate = new Date(date.getTime() + istOffset);
    return istDate.toISOString().split("T")[0]; // Format YYYY-MM-DD
  };

  // ✅ Fetch booked slots from the backend
  const fetchBookedSlots = async (date: Date) => {
    try {
      const formattedDate = convertToIST(date);
      const response = await fetch(
        `http://localhost:5001/api/meetings?date=${formattedDate}`
      );
      const data = await response.json();

      if (response.ok) {
        const takenTimes = data.map((slot: { time: string }) => slot.time);
        setBookedSlots(takenTimes); // ✅ Update state with booked slots
      } else {
        setMessage("Failed to fetch booked slots.");
        setMessageColor("red");
      }
    } catch (error) {
      console.error("Error fetching booked slots:", error);
    }
  };

  // ✅ Fetch booked slots when date is selected
  useEffect(() => {
    if (!selectedDate) return;
    fetchBookedSlots(selectedDate);
  }, [selectedDate]);

  // ✅ Handle Form Submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedDate || !selectedTime || !name || !phoneNumber) {
      setMessage("Please fill in all required fields.");
      setMessageColor("red");
      return;
    }

    const formData = {
      name,
      phoneNumber,
      email,
      comment,
      date: convertToIST(selectedDate),
      time: selectedTime,
    };

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5001/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        setMessage("Slot booked successfully!");
        setMessageColor("green");
        setName("");
        setPhoneNumber("");
        setEmail("");
        setComment("");
        setSelectedTime("");

        // ✅ Re-fetch booked slots immediately
        setTimeout(() => {
          if (selectedDate) fetchBookedSlots(selectedDate);
        }, 500);
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
      {/* Header Image */}
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

        {/* Form Fields */}
        <div className="slot-form-fields-container">
          <div className="slot-form__field">
            <label>Name:</label>
            <input
              type="text"
              className="slot-form__input"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="slot-form__field">
            <label>Phone Number:</label>
            <input
              type="text"
              className="slot-form__input"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="slot-form__field">
            <label>Email:</label>
            <input
              type="email"
              className="slot-form__input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="slot-form__field">
            <label>Comments:</label>
            <textarea
              className="slot-form__textarea"
              placeholder="Any additional comments?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
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
              <option
                key={index}
                value={slot}
                disabled={bookedSlots.includes(slot)}
              >
                {slot} {bookedSlots.includes(slot) ? "(Booked)" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="slot-button-div">
          <button
            type="submit"
            className="slot-form__button"
            disabled={loading || bookedSlots.includes(selectedTime)}
          >
            {loading ? "Booking..." : "BOOK SLOT"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SlotForm;
