import React, { useState, useEffect } from "react";
import "./ManageSlots.css"; // Custom CSS file
import SlotItem from "./SlotItem";
import SlotPopup from "./SlotPopup";
import AppointmentSlot from "./AppointmentSlot"; // Component to display appointments

interface Slot {
  id: string;
  time: string;
  date: string;
  status: "Available" | "Booked" | "Unavailable";
}

interface ManageSlotsProps {
  onBack: () => void;
}

const ManageSlots: React.FC<ManageSlotsProps> = ({ onBack }) => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  useEffect(() => {
    fetch("http://localhost:5001/api/meetings") // Fetch slots from backend
      .then((res) => res.json())
      .then((data) => setSlots(data));
  }, []);

  const handleSlotClick = (slot: Slot) => {
    if (slot.status === "Booked") return;
    setSelectedSlot(slot);
  };

  const handleUpdateStatus = (newStatus: "Available" | "Unavailable") => {
    if (!selectedSlot) return;

    fetch(`http://localhost:5001/api/meetings/${selectedSlot.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    }).then(() => {
      setSlots((prevSlots) =>
        prevSlots.map((slot) =>
          slot.id === selectedSlot.id ? { ...slot, status: newStatus } : slot
        )
      );
      setSelectedSlot(null);
    });
  };

  return (
    <div className="manage-slots">
      {/* Back button to return to Agent Dashboard */}
      <button className="back-btn" onClick={onBack}>
        &larr; Back
      </button>

      <h2>Manage Slots</h2>

      <div className="slots-container">
        {slots.map((slot) => (
          <SlotItem
            key={slot.id}
            time={slot.time}
            status={slot.status}
            onClick={() => handleSlotClick(slot)}
          />
        ))}
      </div>

      {selectedSlot && (
        <SlotPopup
          time={selectedSlot.time}
          date={selectedSlot.date}
          onClose={() => setSelectedSlot(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* Displaying Scheduled Appointments below slots */}
      <AppointmentSlot />
    </div>
  );
};

export default ManageSlots;
