import React from "react";
import { Link } from "react-router-dom";
import "./AgentDashboard.css"; // Import CSS for styling

import agentImage from "../assets/adminimage.jpg"; // Import agent image

const AgentDashboard: React.FC = () => {
  // Dummy appointment data (Replace with actual API data)
  const appointments = [
    {
      date: "24th February, 2025",
      slots: ["6:00PM - 7:00PM", "7:00PM - 8:00PM"],
    },
    {
      date: "25th February, 2025",
      slots: ["6:00PM - 7:00PM", "7:00PM - 8:00PM"],
      tag: "LIC",
    },
  ];

  return (
    <div className="agent-dashboard">
      {/* Header image */}
      <img src={agentImage} alt="agent Image" className="agent-image" />

      <div className="agent-content">
        <h2>Welcome, Satyam!</h2>

        {/* Manage Buttons */}
        <div className="agent-buttons">
          <Link to="/manage-policies" className="agent-btn">
            Manage Policies
          </Link>
          <Link to="/manage-slots" className="agent-btn">
            Manage Appointments
          </Link>
        </div>

        {/* Scheduled Appointments */}
        <h3>Scheduled Appointments</h3>
        {appointments.map((appointment, index) => (
          <div key={index} className="appointment-container">
            <div className="appointment-date">
              {appointment.date}
              {appointment.tag && (
                <span className="appointment-tag">{appointment.tag}</span>
              )}
            </div>
            <ul className="appointment-list">
              {appointment.slots.map((slot, idx) => (
                <li key={idx} className="appointment-slot">
                  ➤ {slot}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentDashboard;
