import React, { useState } from "react";
import axios from "axios";
import "./SlotPopup.css";

interface Slot {
  time: string;
  date: string;
  status: "Available" | "Booked" | "Unavailable";
  meetingType?: "policy" | "career";
}

interface SlotPopupProps {
  slot: Slot;
  ownerId: string;
  onClose: () => void;
  onStatusChange: (newStatus: "Available" | "Unavailable") => Promise<void>;
}

const SlotPopup: React.FC<SlotPopupProps> = ({ slot, ownerId, onClose, onStatusChange }) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (newStatus: "Available" | "Unavailable") => {
    setIsLoading(true);
    setError(null);

    try {
      const updatePayload = {
        ownerId,
        date: slot.date,
        time: slot.time,
        status: newStatus,
        meetingType: slot.meetingType || "career", // default to "career" if missing
      };

      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/freeslots/update`, updatePayload);

      if (response.data.success) {
        // If update is successful, call parent's callback to update UI.
        await onStatusChange(newStatus);
        onClose(); // Close popup after success.
      } else {
        throw new Error(response.data.message || "Failed to update slot.");
      }
    } catch (err) {
      console.error("Error updating slot:", err);
      setError("Error updating slot. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="slot-popup">
      <h3>MANAGE SLOT</h3>
      <p>Time: {slot.time}</p>
      <p>Status: {slot.status}</p>
      {error && <div className="error-message">{error}</div>}
      <button
        className="available"
        onClick={() => handleStatusChange("Available")}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Available"}
      </button>
      <button
        className="unavailable"
        onClick={() => handleStatusChange("Unavailable")}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Unavailable"}
      </button>
      <button className="close" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default SlotPopup;
