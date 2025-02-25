import React, { useState, useEffect } from "react";
import SlotItem from "../components/SlotItem";
import SlotPopup from "../components/SlotPopup";

interface Slot {
  id: string;
  time: string;
  date: string;
  status: "Available" | "Booked" | "Unavailable";
}

const ManageSlots: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  useEffect(() => {
    fetch("http://localhost:5001/api/slots") // Fetch slots from backend
      .then((res) => res.json())
      .then((data) => setSlots(data));
  }, []);

  const handleSlotClick = (slot: Slot) => {
    if (slot.status === "Booked") return;
    setSelectedSlot(slot);
  };

  const handleUpdateStatus = (newStatus: "Available" | "Unavailable") => {
    if (!selectedSlot) return;

    fetch(`http://localhost:5001/api/slots/${selectedSlot.id}`, {
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
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">Manage Slots</h2>

      <div className="grid grid-cols-3 gap-4">
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
    </div>
  );
};

export default ManageSlots;
