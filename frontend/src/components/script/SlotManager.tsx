import React, { useState, useEffect } from "react";
import "./SlotManager.css";
import SlotCard from "./SlotCard";
import StatusEditor from "./StatusEditor";
import dayjs from "dayjs";

interface Slot {
  timeSlot: string;
  date: string;
  status: "Scheduled" | "Available" | "Unavailable";
}

const TIME_SLOTS = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM",
  "01:00 PM - 02:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
];

const SlotManager: React.FC<{ employeeId: string }> = ({ employeeId }) => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [currentDate, setCurrentDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:5001/api/meetings?employeeId=${employeeId}&date=${currentDate}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch slots: ${response.statusText}`);
        }

        const savedSlots = await response.json();

        // Merge saved slots with default time slots
        const allSlots = TIME_SLOTS.map((timeSlot) => {
          const existingSlot = savedSlots.find((slot: Slot) => slot.timeSlot === timeSlot);
          return existingSlot || { timeSlot, date: currentDate, status: "Available" };
        });

        setSlots(allSlots);
      } catch (error) {
        console.error("Error fetching slots:", error);
        setError(String(error));
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [currentDate, employeeId]);

  const handleSlotClick = (slot: Slot) => {
    if (slot.status === "Scheduled") return;
    setSelectedSlot(slot);
  };

  const handleDateChange = (days: number) => {
    setCurrentDate((prevDate) => dayjs(prevDate).add(days, "day").format("YYYY-MM-DD"));
  };

  const handleStatusChange = async (newStatus: "Available" | "Unavailable") => {
    if (!selectedSlot) return;

    try {
      const response = await fetch("http://localhost:5001/api/meetings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId,
          date: selectedSlot.date,
          timeSlot: selectedSlot.timeSlot,
          status: newStatus,
        }),
      });

      if (!response.ok) throw new Error("Failed to update slot status");

      // Update UI
      setSlots((prevSlots) =>
        prevSlots.map((s) =>
          s.timeSlot === selectedSlot.timeSlot ? { ...s, status: newStatus } : s
        )
      );

      setSelectedSlot(null);
    } catch (error) {
      console.error("Error updating slot status:", error);
    }
  };

  return (
    <div className="slot-manager-container">
      <h2>Manage Availability</h2>

      <div className="date-selector">
        <button onClick={() => handleDateChange(-1)}>&lArr;</button>
        <h3>{dayjs(currentDate).format("DD MMMM, YYYY")}</h3>
        <button onClick={() => handleDateChange(1)}>&rArr;</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading slots...</div>
      ) : (
        <div className="slots-container">
          {slots.map((slot) => (
            <SlotCard key={slot.timeSlot} slot={slot} onClick={() => handleSlotClick(slot)} />
          ))}
        </div>
      )}

      {selectedSlot && (
        <div className="popup-overlay">
          <StatusEditor slot={selectedSlot} onClose={() => setSelectedSlot(null)} onStatusChange={handleStatusChange} />
        </div>
      )}
    </div>
  );
};

export default SlotManager;
