import React, { useState } from "react";
import "./StatusEditor.css";

interface Slot {
  timeSlot: string;
  date: string;
  status: "Scheduled" | "Available" | "Unavailable";
}

interface StatusEditorProps {
  slot: Slot;
  onClose: () => void;
  onStatusChange: (newStatus: "Available" | "Unavailable") => void;
}

const StatusEditor: React.FC<StatusEditorProps> = ({ slot, onClose, onStatusChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: "Available" | "Unavailable") => {
    if (slot.status === "Scheduled") return; // Prevent modifying scheduled slots

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5001/api/meetings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: slot.date,
          timeSlot: slot.timeSlot,
          status: newStatus,
        }),
      });

      if (!response.ok) throw new Error("Failed to update slot status");

      onStatusChange(newStatus);
      onClose();
    } catch (error) {
      console.error("Error updating slot status:", error);
      setError(String(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="status-editor">
      <h3>Manage Slot</h3>
      <p>Time: {slot.timeSlot}</p>
      <p>Status: {slot.status}</p>

      {error && <div className="error-message">{error}</div>}

      <button
        className="available"
        onClick={() => handleStatusChange("Available")}
        disabled={isLoading || slot.status === "Scheduled"} // Disable if Scheduled
      >
        {isLoading ? "Processing..." : "Available"}
      </button>
      <button
        className="unavailable"
        onClick={() => handleStatusChange("Unavailable")}
        disabled={isLoading || slot.status === "Scheduled"} // Disable if Scheduled
      >
        {isLoading ? "Processing..." : "Unavailable"}
      </button>
      <button className="close" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default StatusEditor;
