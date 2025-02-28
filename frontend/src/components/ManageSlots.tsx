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

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/meetings?date=${currentDate}`
        );
        const bookedMeetings = await response.json();

        const allSlots = TIME_SLOTS.map((timeString) => {
          const isBooked = bookedMeetings.some(
            (meeting: { time: string }) => meeting.time === timeString
          );
          return {
            time: timeString,
            date: currentDate,
            status: isBooked ? ("Booked" as const) : ("Available" as const),
          };
        });

        setSlots(allSlots);
      } catch (error) {
        console.error("Error fetching slots:", error);
      }
    };

    fetchSlots();
  }, [currentDate]);

  const handleSlotClick = (slot: Slot) => {
    if (slot.status === "Booked") return;
    setSelectedSlot(slot);
  };

  const handleDateChange = (days: number) => {
    setCurrentDate((prevDate) =>
      dayjs(prevDate).add(days, "day").format("YYYY-MM-DD")
    );
  };

  return (
    <div className="manage-slots">
      <button className="back-btn" onClick={onBack}>
        &larr; Back
      </button>

      <h2>Manage Slots</h2>

      <div className="date-selector">
        <button onClick={() => handleDateChange(-1)}>{"<<"}</button>
        <h3>{dayjs(currentDate).format("DD MMMM, YYYY")}</h3>
        <button onClick={() => handleDateChange(1)}>{">>"}</button>
      </div>

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

      {selectedSlot && (
        <SlotPopup
          time={selectedSlot.time}
          date={selectedSlot.date}
          onClose={() => setSelectedSlot(null)}
          onUpdateStatus={(newStatus) => {
            setSlots((prevSlots) =>
              prevSlots.map((s) =>
                s.time === selectedSlot.time ? { ...s, status: newStatus } : s
              )
            );
            setSelectedSlot(null);
          }}
        />
      )}

      <AppointmentSlot />
    </div>
  );
};

export default ManageSlots;
