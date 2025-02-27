import React from "react";
import "./SlotItem.css";

interface SlotItemProps {
  time: string;
  status: "Booked" | "Available" | "Unavailable";
  onClick: () => void;
}

const SlotItem: React.FC<SlotItemProps> = ({ time, status, onClick }) => {
  const statusClass = status.toLowerCase(); // Convert to lowercase for CSS

  return (
    <div className={`slot-item ${statusClass}`} onClick={onClick}>
      <span>{time}</span>
      <p>{status}</p>
    </div>
  );
};

export default SlotItem;
