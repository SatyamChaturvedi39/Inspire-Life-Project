import React, { useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: "Available" | "Unavailable") => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:5001/api/meetings/update-status",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ date, time, status: newStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update slot status.");
      }

      onUpdateStatus(newStatus); // Update UI after successful API call
      onClose(); // Close the popup after status update
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="slot-popup">
      <div className="popup-content">
        <h3>{date}</h3>
        <p>{time}</p>
        <p>Mark as:</p>
        <div className="popup-buttons">
          <button
            className="available-btn"
            onClick={() => handleStatusChange("Available")}
            disabled={loading}
          >
            {loading ? "Updating..." : "Available"}
          </button>
          <button
            className="unavailable-btn"
            onClick={() => handleStatusChange("Unavailable")}
            disabled={loading}
          >
            {loading ? "Updating..." : "Unavailable"}
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
        <button className="close-btn" onClick={onClose} disabled={loading}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SlotPopup;
