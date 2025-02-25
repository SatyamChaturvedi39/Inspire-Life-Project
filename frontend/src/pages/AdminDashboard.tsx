import React from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css"; // Import CSS for styling

import adminImage from "../assets/adminimage.jpg"; // Import admin image

const AdminDashboard: React.FC = () => {
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
    <div className="admin-dashboard">
      {/* Header image */}
      <img src={adminImage} alt="Admin Image" className="admin-image" />

      <div className="admin-content">
        <h2>Welcome, Satyam!</h2>

        {/* Manage Buttons */}
        <div className="admin-buttons">
          <Link to="/manage-policies" className="admin-btn">
            Manage Policies
          </Link>
          <Link to="/manage-slots" className="admin-btn">
            Manage Policies
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

export default AdminDashboard;
