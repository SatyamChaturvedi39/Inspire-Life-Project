import React, { useEffect, useState } from "react";
import "./AppointmentSlot.css";

interface Slot {
  _id: string;
  name: string;
  phoneNumber: string;
  date: string;
  time?: string; // Marking it as optional
  status: string;
}

const AppointmentSlot: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/meetings");
        if (!response.ok) {
          throw new Error("Failed to fetch slots");
        }
        const data = await response.json();
        setSlots(data);
      } catch (error) {
        console.error("Error fetching slots:", error);
        setError("Failed to fetch slots. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const getOrdinalSuffix = (day: number): string => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };
    return `${day}${getOrdinalSuffix(day)} ${month}, ${year}`;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parseTime = (time: string | undefined): number => {
    if (!time) return 0;
    const match = time.match(/(\d+)(?::(\d+))?\s*(AM|PM)?/i);
    if (!match) return 0;
    let hours = parseInt(match[1], 10);
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    const period = match[3];
    if (period) {
      if (period.toUpperCase() === "PM" && hours !== 12) hours += 12;
      if (period.toUpperCase() === "AM" && hours === 12) hours = 0;
    }
    return hours * 60 + minutes;
  };

  const filteredSlots = slots
    .filter(
      (slot) => slot.phoneNumber !== "N/A" && new Date(slot.date) >= today
    )
    .sort((a, b) => {
      const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateDiff !== 0) return dateDiff;
      return parseTime(a.time) - parseTime(b.time);
    });

  const groupedSlots: { [key: string]: Slot[] } = {};
  filteredSlots.forEach((slot) => {
    const dateKey = formatDate(slot.date);
    if (!groupedSlots[dateKey]) {
      groupedSlots[dateKey] = [];
    }
    groupedSlots[dateKey].push(slot);
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="appointment-slot-container">
      <h2>Scheduled Appointments</h2>
      {Object.keys(groupedSlots).length === 0 ? (
        <p>No slots booked yet.</p>
      ) : (
        Object.entries(groupedSlots).map(([date, slots]) => (
          <div key={date}>
            <h3 className="date-group">{date}</h3>
            <ul className="slot-list">
              {slots.map((slot) => (
                <li key={slot._id} className="slot-item-appointment">
                  <p>
                    <strong>&rArr; {slot.time || "TBA"}</strong> - {slot.name} : +91{" "}
                    {slot.phoneNumber}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default AppointmentSlot;