import React, { useState, useEffect } from "react";
import "./ManageSlots.css";
import SlotItem from "./SlotItem";
import SlotPopup from "./SlotPopup";
import AppointmentSlot from "./AppointmentSlot";
import dayjs from "dayjs"; // Ensure you install this using: npm install dayjs

interface Slot {
  time: string;
  date: string;
  status: "Available" | "Booked" | "Unavailable";
}

interface ManageSlotsProps {
  onBack: () => void;
}

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 17; hour++) {
    const time = `${hour % 12 || 12}:00 ${hour >= 12 ? "PM" : "AM"} - ${
      (hour + 1) % 12 || 12
    }:00 ${hour + 1 >= 12 ? "PM" : "AM"}`;
    slots.push(time);
  }
  return slots;
};

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
        const bookedSlots = await response.json();

        const allSlots = generateTimeSlots().map((time) => {
          const isBooked = bookedSlots.some((slot: Slot) => slot.time === time);
          return {
            time,
            date: currentDate,
            status: isBooked ? "Booked" : "Available",
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

  const changeDate = (days: number) => {
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
        <button onClick={() => changeDate(-1)}>{"<<"}</button>
        <h3>{dayjs(currentDate).format("DD MMMM, YYYY")}</h3>
        <button onClick={() => changeDate(1)}>{">>"}</button>
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
              prevSlots.map((slot) =>
                slot.time === selectedSlot.time
                  ? { ...slot, status: newStatus }
                  : slot
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
