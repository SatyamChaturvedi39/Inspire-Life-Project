import React from "react";
import "./BookingConfirmationPopup.css";

interface BookingConfirmationPopupProps {
  onClose: () => void;
  bookingDetails: {
    name: string;
    date: string;
    time: string;
  };
}

const BookingConfirmationPopup: React.FC<BookingConfirmationPopupProps> = ({
  onClose,
  bookingDetails,
}) => {
  console.log("Popup received bookingDetails:", bookingDetails);
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2 className="heading-popup"> Booking Confirmed!</h2>
        <p>
          <strong>Name:</strong> {bookingDetails.name}
        </p>
        <p>
          <strong>Date:</strong> {bookingDetails.date}
        </p>
        <p>
          <strong>Time:</strong> {bookingDetails.time}
        </p>
        <button className="popup-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmationPopup;
