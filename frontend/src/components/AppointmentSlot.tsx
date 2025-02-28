import React, { useEffect, useState } from "react";
import "./AppointmentSlot.css"; // Assuming you have a CSS file for styling

interface Slot {
  _id: string;
  name: string;
  phoneNumber: string;
  date: string; // Assuming date is stored as a string in "YYYY-MM-DD" format
  time: string;
  status: string;
}

const AppointmentSlot: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch slots from the backend
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

  // Function to format the date as "24th February, 2025"
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    // Add ordinal suffix to the day (e.g., 1st, 2nd, 3rd, 4th, etc.)
    const getOrdinalSuffix = (day: number): string => {
      if (day > 3 && day < 21) return "th"; // 11th, 12th, 13th, etc.
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

  // Filter out slots with phoneNumber "N/A" and sort by date
  const filteredSlots = slots
    .filter((slot) => slot.phoneNumber !== "N/A")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Group slots by date
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
          <div key={date} className="date-group">
            <h3>{date}</h3>
            <ul className="slot-list">
              {slots.map((slot) => (
                <li key={slot._id} className="slot-item">
                  <p>
                    <strong>{slot.time}</strong> - Booked by: {slot.name}
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
