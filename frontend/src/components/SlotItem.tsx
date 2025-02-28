import React from "react";
import "./SlotItem.css";

interface SlotItemProps {
  time: string;
  status: "Booked" | "Available" | "Unavailable";
  onClick: () => void;
}

const SlotItem: React.FC<SlotItemProps> = ({ time, status, onClick }) => {
  const statusClass = status.toLowerCase(); // Convert to lowercase for CSS

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any default behavior
    console.log("Slot clicked:", time, status); // Add logging to debug
    if (status !== "Booked") {
      onClick();
    } else {
      console.log("Slot is booked, cannot modify"); // Add logging for this case
    }
  };

  return (
    <div className={`slot-item ${statusClass}`} onClick={handleClick}>
      <span>{time}</span>
      <p>{status}</p>
    </div>
  );
};

export default SlotItem;
