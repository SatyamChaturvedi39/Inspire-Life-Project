import React, { useState } from "react";
import "./AdminDashboard.css"; // Import CSS for styling
import adminImage from "../assets/adminimage.jpg"; // Import admin image
import ManagePolicies from "../components/ManagePolicies"; // Import the ManagePolicies component
import ManageSlots from "../components/ManageSlots"; // Import the ManageSlots component
import AppointmentSlot from "../components/AppointmentSlot"; // Import the AppointmentSlot component

const AdminDashboard: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<
    "default" | "managePolicies" | "manageSlots"
  >("default");

  return (
    <div className="admin-dashboard">
      {/* Header image */}
      <img src={adminImage} alt="Admin Image" className="admin-image" />

      <div className="admin-content">
        {activeComponent === "default" ? (
          <>
            <h2>Welcome, Satyam!</h2>

            {/* Manage Buttons */}
            <div className="admin-buttons">
              <button
                className="admin-btn"
                onClick={() => setActiveComponent("managePolicies")}
              >
                Manage Policies
              </button>
              <button className="admin-btn">Manage Clients</button>
              <button
                className="admin-btn"
                onClick={() => setActiveComponent("manageSlots")}
              >
                Manage Applicants
              </button>
              <button className="admin-btn">Manage Agents</button>
              <button className="admin-btn">Show Leads</button>
            </div>

            {/* Appointment Slot Section */}
            <div className="appointment-slot-section2">
              <AppointmentSlot />
            </div>
          </>
        ) : activeComponent === "managePolicies" ? (
          <ManagePolicies
            onBack={() => setActiveComponent("default")}
            onUpdate={(policyId: string) => {
              console.log("Update policy:", policyId);
            }}
            onAdd={() => {
              console.log("Add policy");
            }}
            onDelete={() => {
              console.log("Delete policy");
            }}
          />
        ) : (
          <ManageSlots onBack={() => setActiveComponent("default")} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;