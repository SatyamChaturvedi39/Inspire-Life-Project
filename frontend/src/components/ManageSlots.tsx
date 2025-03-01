import React, { useState, useEffect } from "react";
import "./ManageSlots.css";
import SlotItem from "./SlotItem";
import SlotPopup from "./SlotPopup";
import AppointmentSlot from "./AppointmentSlot";
import dayjs from "dayjs";

interface Slot {
  time: string;
  date: string;
  status: "Available" | "Booked" | "Unavailable";
}

interface ManageSlotsProps {
  onBack: () => void;
}

/**
 * IMPORTANT: Use the same time slots
 * that SlotForm.tsx uses.
 */
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

const ManageSlots: React.FC<ManageSlotsProps> = ({ onBack }) => {
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
          `http://localhost:5001/api/meetings?date=${currentDate}`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch slots: ${response.status} ${response.statusText}`
          );
        }

        const bookedMeetings = await response.json();

        const allSlots = TIME_SLOTS.map((timeString) => {
          const meeting = bookedMeetings.find(
            (meeting: { time: string; status: string }) =>
              meeting.time === timeString
          );

          // If a meeting exists, use its status, otherwise mark as "Available"
          return {
            time: timeString,
            date: currentDate,
            status: meeting
              ? (meeting.status as "Available" | "Booked" | "Unavailable")
              : "Available",
          };
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
  }, [currentDate]);

  const handleSlotClick = (slot: Slot) => {
    console.log("Slot clicked in ManageSlots:", slot); // Debug logging
    if (slot.status === "Booked") {
      console.log("Cannot edit booked slot");
      return;
    }
    setSelectedSlot(slot);
  };

  const handleDateChange = (days: number) => {
    setCurrentDate((prevDate) =>
      dayjs(prevDate).add(days, "day").format("YYYY-MM-DD")
    );
  };

  const handleStatusChange = (newStatus: "Available" | "Unavailable") => {
    if (!selectedSlot) return;

    setSlots((prevSlots) =>
      prevSlots.map((s) =>
        s.time === selectedSlot.time ? { ...s, status: newStatus } : s
      )
    );
    setSelectedSlot(null);
  };

  return (
    <>
      <button className="back-btn" onClick={onBack}>
        &#x21E6; Back
      </button>

      <h2>Manage Slots</h2>
      <div className="manage-slots">
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
              <SlotItem
                key={slot.time}
                time={slot.time}
                status={slot.status}
                onClick={() => handleSlotClick(slot)}
              />
            ))}
          </div>
        )}

        {selectedSlot && (
          <div className="popup-overlay">
            <SlotPopup
              slot={selectedSlot}
              onClose={() => setSelectedSlot(null)}
              onStatusChange={handleStatusChange}
            />
          </div>
        )}
      </div>
      <AppointmentSlot />
    </>
  );
};

export default ManageSlots;
