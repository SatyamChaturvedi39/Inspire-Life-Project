import React, { useState, useEffect } from "react";
import "./ManageMeetings.css";
import SlotItem from "./SlotItem";
import SlotPopup from "./SlotPopup";
import AppointmentSlot from "./AppointmentSlot";
import dayjs from "dayjs";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

interface Slot {
  time: string;
  date: string;
  status: "Available" | "Booked" | "Unavailable";
  meetingType?: "career" | "policy";
}

interface ManageMeetingsProps {
  onBack: () => void;
  meetingType: "career" | "policy";
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

const ManageMeetings: React.FC<ManageMeetingsProps> = ({ onBack, meetingType }) => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [currentDate, setCurrentDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id: ownerId } = useAuth();
  const safeOwnerId = ownerId ?? "";

  // Use a header title based on meetingType.
  const headerTitle = meetingType === "policy" ? "Manage Clients" : "Manage Applicants";

  // Fetch free slots for the given date.
  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      setError(null);
      try {
        // Query by date and ownerId (we ignore meetingType for free slot lookup)
        const query = `?date=${currentDate}&ownerId=${safeOwnerId}`;
        const response = await axios.get(`${import.meta.env.BACKEND_URL}/api/freeslots` + query);
        if (response.data.success) {
          const freeSlots: any[] = response.data.data;
          const allSlots: Slot[] = TIME_SLOTS.map((timeString): Slot => {
            const slot = freeSlots.find((m) => m.time === timeString);
            return {
              time: timeString,
              date: currentDate,
              status: slot ? slot.status : "Available",
              meetingType, // tag for downstream usage
            };
          });
          setSlots(allSlots);
        } else {
          setError("Failed to fetch free slots.");
        }
      } catch (error: any) {
        console.error("Error fetching slots:", error);
        setError(String(error));
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [currentDate, safeOwnerId, meetingType]);

  const handleSlotClick = (slot: Slot) => {
    // Allow admin/agent to click on any slot (even if booked) to override it.
    setSelectedSlot(slot);
  };

  const handleDateChange = (days: number) => {
    const newDate = dayjs(currentDate).add(days, "day");
    if (newDate.isBefore(dayjs().startOf("day"))) return;
    setCurrentDate(newDate.format("YYYY-MM-DD"));
  };

  // Callback to update local state after slot status update.
  const handleSlotStatusChange = async (newStatus: "Available" | "Unavailable") => {
    setSlots((prevSlots) =>
      prevSlots.map((s) =>
        s.time === selectedSlot?.time ? { ...s, status: newStatus } : s
      )
    );
    setSelectedSlot(null);
  };

  return (
    <div className="manage-meetings">
      <button className="back-btn" onClick={onBack}>
        &#x21E6; Back
      </button>
      <h2>{headerTitle}</h2>
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
              ownerId={safeOwnerId}
              onClose={() => setSelectedSlot(null)}
              onStatusChange={handleSlotStatusChange}
            />
          </div>
        )}
      </div>
      {/* Render the scheduled appointments for this meetingType.
          When used in a management view, we filter by meetingType so that:
          - Manage Clients shows only policy meetings (without extra label)
          - Manage Applicants shows only career meetings (without extra label) */}
      <div className="appointment-slot-section">
        <AppointmentSlot filterType={meetingType} ownerId={safeOwnerId} />
      </div>
    </div>
  );
};

export default ManageMeetings;
