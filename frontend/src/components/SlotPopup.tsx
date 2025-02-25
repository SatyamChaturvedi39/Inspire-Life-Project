import React from "react";

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
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold">Manage Slot</h2>
        <p>
          {date} - {time}
        </p>

        <div className="flex justify-between mt-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => onUpdateStatus("Available")}
          >
            Available
          </button>

          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => onUpdateStatus("Unavailable")}
          >
            Unavailable
          </button>
        </div>

        <button className="mt-4 text-gray-500" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SlotPopup;
