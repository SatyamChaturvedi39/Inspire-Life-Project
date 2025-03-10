import React, { useState } from "react";
import "./AdminDashboard.css"; // Import CSS for styling
import adminImage from "../assets/adminimage.jpg"; // Import admin image
import ManagePolicies from "../components/ManagePolicies"; // Import the ManagePolicies component
import ManageSlots from "../components/ManageSlots"; // Import the ManageSlots component
import ManageClients from "../components/ManageClients"; // Import the ManageClients component
import RecentLeads from "../components/RecentLeads"; // Import the RecentLeads component
import AppointmentSlot from "../components/AppointmentSlot"; // Import the AppointmentSlot component

const AdminDashboard: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<
    "default" | "managePolicies" | "manageClients" | "manageApplicants" | "manageSlots" | "showLeads"
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
              <button
                className="admin-btn"
                onClick={() => setActiveComponent("manageClients")}
              >
                Manage Clients
              </button>
              <button
                className="admin-btn"
                onClick={() => setActiveComponent("manageApplicants")}
              >
                Manage Applicants
              </button>
              <button className="admin-btn">Manage Agents</button>
              <button
                className="admin-btn"
                onClick={() => setActiveComponent("showLeads")}
              >
                Show Leads
              </button>
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
        ) : activeComponent === "manageClients" ? (
          <ManageClients onBack={() => setActiveComponent("default")} />
        ) : activeComponent === "manageApplicants" ? (
          <ManageSlots onBack={() => setActiveComponent("default")} />
        ) : activeComponent === "showLeads" ? (
          <RecentLeads onBack={() => setActiveComponent("default")} />
        ) : null}
      </div>
    </div>
  );
};

export default AdminDashboard;