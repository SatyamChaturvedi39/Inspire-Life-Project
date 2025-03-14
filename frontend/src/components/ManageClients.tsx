import React, { useState, useEffect } from "react";
import "./ManageClients.css";
import ClientAppointmentSlot from "./ClientAppointmentSlot";
interface PolicyData {
  id: string;
  name: string;
  details: string;
}

interface ManageClientsProps {
  onBack: () => void;
}

const ManageClients: React.FC<ManageClientsProps> = ({ onBack }) => {
  const [policies, setPolicies] = useState<PolicyData[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyData | null>(null);
  const [showSlotManagement, setShowSlotManagement] = useState(false); // Toggle slot management popup
  const [selectedDate, setSelectedDate] = useState<string>(""); // For slot management
  const [availability, setAvailability] = useState<{ [key: string]: string }>({}); // Track slot availability

  // Generate all time slots from 9 AM to 5 PM
  const allTimeSlots = [];
  for (let hour = 9; hour <= 16; hour++) {
    const formattedHour = hour <= 12 ? hour : hour - 12;
    const nextHour = hour + 1 <= 12 ? hour + 1 : hour + 1 - 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const nextAmPm = hour + 1 < 12 ? "AM" : "PM";
    allTimeSlots.push(`${formattedHour}:00 ${amPm} - ${nextHour}:00 ${nextAmPm}`);
  }

  // Fetch policies from the backend
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/policymeetings");
        if (!response.ok) {
          throw new Error("Failed to fetch policies");
        }
        const data = await response.json();
        setPolicies(data);
      } catch (error) {
        console.error("Error fetching policies:", error);
      }
    };

    fetchPolicies();
  }, []);

  // Handle policy card click
  const handlePolicyClick = (policy: PolicyData) => {
    setSelectedPolicy(policy);
    setShowSlotManagement(true); // Open slot management popup
  };

  // Handle slot availability toggle
  const handleSlotClick = (slot: string) => {
    setAvailability((prev) => ({
      ...prev,
      [slot]: prev[slot] === "available" ? "unavailable" : "available",
    }));
  };

  return (
    <div className="manage-clients">
      <button className="back-btn" onClick={onBack}>
        &#x21E6; Back
      </button>
      <h2>Manage Clients</h2>
      <div className="policy-list">
        {policies.length > 0 ? (
          policies.map((policy) => (
            <div
              key={policy.id}
              className="policy-item"
              onClick={() => handlePolicyClick(policy)}
            >
              {policy.name}
            </div>
          ))
        ) : (
          <p>No policies available.</p>
        )}
      </div>

      {/* Slot Management Popup */}
      {showSlotManagement && (
        <div className="slot-management-overlay">
          <div className="slot-management-container">
            <div className="slot-management-header">
              <h2>Manage Slot Availability</h2>
              <div className="slot-management-close" onClick={() => setShowSlotManagement(false)}>
                ×
              </div>
            </div>
            <div className="slot-management-content">
              <div className="date-navigation">
                <button onClick={() => setSelectedDate("2023-10-10")}>Previous</button>
                <span>{selectedDate}</span>
                <button onClick={() => setSelectedDate("2023-10-12")}>Next</button>
              </div>
              <div className="slot-grid">
                {allTimeSlots.map((slot) => (
                  <div
                    key={slot}
                    className={`slot-item ${availability[slot] === "unavailable" ? "unavailable" : ""}`}
                    onClick={() => handleSlotClick(slot)}
                  >
                    {slot} {availability[slot] === "unavailable" ? "(Unavailable)" : ""}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <ClientAppointmentSlot/>
    </div>
  );
};

export default ManageClients;