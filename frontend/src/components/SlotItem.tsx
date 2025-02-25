import React from "react";

interface SlotItemProps {
  time: string;
  status: "Available" | "Booked" | "Unavailable";
  onClick: () => void;
}

const SlotItem: React.FC<SlotItemProps> = ({ time, status, onClick }) => {
  const getStatusColor = () => {
    switch (status) {
      case "Available":
        return "bg-green-200 text-green-800";
      case "Booked":
        return "bg-blue-200 text-blue-800";
      case "Unavailable":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200";
    }
  };

  return (
    <div
      className={`p-2 rounded-lg text-center font-semibold cursor-pointer ${getStatusColor()}`}
      onClick={onClick}
    >
      {time}
    </div>
  );
};

export default SlotItem;
