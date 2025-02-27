import React from "react";
import "./SlotItem.css";

interface SlotItemProps {
  time: string;
  status: "Booked" | "Available" | "Unavailable";
  onClick: () => void;
}

const SlotItem: React.FC<SlotItemProps> = ({ time, status, onClick }) => {
  // Function to generate class based on status
  const getStatusClass = (status: string) => {
    switch (status) {
      case "Booked":
        return "slot-booked";
      case "Available":
        return "slot-available";
      case "Unavailable":
        return "slot-unavailable";
      default:
        return "";
    }
  };

  return (
    <div className={`slot-item ${getStatusClass(status)}`} onClick={onClick}>
      <span>{time}</span>
      <p>{status}</p>
    </div>
  );
};

export default SlotItem;
