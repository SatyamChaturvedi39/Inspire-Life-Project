import React, { useState } from "react";
import "./AgentDashboard.css";
import agentImage from "../assets/adminimage.jpg";
import ManageSlots from "../components/ManageSlots";
import ManagePolicies from "../components/ManagePolicies";
import AppointmentSlot from "../components/AppointmentSlot";

const AgentDashboard: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<
    "default" | "manageApplicants" | "managePolicies"
  >("default");

  return (
    <div className="agent-dashboard">
      <img src={agentImage} alt="Agent" className="agent-image" />
      <div className="agent-dashboard-details">
        {activeComponent === "default" ? (
          <div className="agent-content">
            <h2>Welcome, Shivakumar!</h2>
            <div className="agent-buttons">
              <button
                className="agent-btn"
                onClick={() => setActiveComponent("managePolicies")}
              >
                Manage Policies
              </button>
              <button
                className="agent-btn"
                onClick={() => setActiveComponent("manageApplicants")}
              >
                Manage Clients
              </button>
              <button className="admin-btn">Show Leads</button>
            </div>

            <div className="appointment-slot-section">
              <AppointmentSlot />
            </div>
          </div>
        ) : activeComponent === "manageApplicants" ? (
          <ManageSlots onBack={() => setActiveComponent("default")} />
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;
