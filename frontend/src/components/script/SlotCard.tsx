import React from "react";
import "./SlotCard.css";

interface SlotCardProps {
  slot: {
    timeSlot: string;
    status: "Scheduled" | "Available" | "Unavailable";
  };
  onClick: () => void;
}

const SlotCard: React.FC<SlotCardProps> = ({ slot, onClick }) => {
  return (
    <div className={`slot-card ${slot.status.toLowerCase()}`} onClick={onClick}>
      <span>{slot.timeSlot}</span>
      <p>{slot.status}</p>
    </div>
  );
};

export default SlotCard;
