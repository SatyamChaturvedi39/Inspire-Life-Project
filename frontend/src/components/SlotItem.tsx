import React from "react";
import "./SlotItem.css";

interface SlotItemProps {
  time: string;
  status: "Booked" | "Available" | "Unavailable";
  onClick: () => void;
}

const SlotItem: React.FC<SlotItemProps> = ({ time, status, onClick }) => {
  const statusClass = status.toLowerCase();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Slot clicked:", time, status);
    // Always call onClick regardless of status in management dashboards.
    onClick();
  };

  return (
    <div className={`slot-item ${statusClass}`} onClick={handleClick}>
      <span>{time}</span>
      <p>{status}</p>
    </div>
  );
};

export default SlotItem;
