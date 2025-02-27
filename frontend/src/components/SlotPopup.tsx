import React from "react";
import "./SlotPopup.css";

interface SlotPopupProps {
  time: string;
  date: string;
  onClose: () => void;
  onUpdateStatus: (newStatus: "Available" | "Unavailable") => void;
}

const SlotPopup: React.FC<SlotPopupProps> = ({
  time,
  date,
  onClose,
  onUpdateStatus,
}) => {
  return (
    <div className="slot-popup">
      <div className="popup-content">
        <h3>{date}</h3>
        <p>{time}</p>
        <p>Mark as:</p>
        <div className="popup-buttons">
          <button
            className="available-btn"
            onClick={() => onUpdateStatus("Available")}
          >
            Available
          </button>
          <button
            className="unavailable-btn"
            onClick={() => onUpdateStatus("Unavailable")}
          >
            Unavailable
          </button>
        </div>
        <button className="close-btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SlotPopup;
