import React, { useState } from "react";
import "./SlotPopup.css";

interface Slot {
  time: string;
  date: string;
  status: "Available" | "Booked" | "Unavailable";
}

interface SlotPopupProps {
  slot: Slot;
  onClose: () => void;
  onStatusChange: (newStatus: "Available" | "Unavailable") => void;
}

const SlotPopup: React.FC<SlotPopupProps> = ({
  slot,
  onClose,
  onStatusChange,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (newStatus: "Available" | "Unavailable") => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:5001/api/meetings/update-status",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: slot.date,
            time: slot.time,
            status: newStatus,
          }),
        }
      );

      // First, get the response as text
      const responseText = await response.text();

      // Try to parse as JSON if possible
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        // If it's not valid JSON, use the text directly
        errorData = responseText;
      }

      if (!response.ok) {
        // Check if the error is related to enum validation
        if (
          typeof errorData === "object" &&
          errorData.error &&
          errorData.error.includes("is not a valid enum value")
        ) {
          throw new Error(
            "The status value is not valid in the database model. Please update your Meeting model to include 'Unavailable' as a valid status."
          );
        } else {
          throw new Error(
            `Failed to update slot status: ${response.status} ${
              response.statusText
            }. ${JSON.stringify(errorData)}`
          );
        }
      }

      // If we got here, the request was successful
      onStatusChange(newStatus);
    } catch (error) {
      console.error("Error updating slot status:", error);
      setError(String(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="slot-popup">
      <h3>MANAGE SLOT</h3>
      <p>Time: {slot.time}</p>
      <p>Status: {slot.status}</p>

      {error && (
        <div className="error-message">
          {error}
          {error.includes("not valid in the database model") && (
            <div className="error-help">
              <p>To fix this issue:</p>
              <ol>
                <li>
                  Update your Meeting model to include "Unavailable" in the
                  status enum
                </li>
                <li>Restart your server</li>
                <li>Try again</li>
              </ol>
            </div>
          )}
        </div>
      )}

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
