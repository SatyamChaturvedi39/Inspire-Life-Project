import React, { useState } from "react";
import "./AgentDashboard.css";
import agentImage from "../assets/adminimage.jpg";
import ManageSlots from "../components/ManageSlots";
import ManagePolicies from "../components/ManagePolicies";
import AppointmentSlot from "../components/AppointmentSlot";
import RecentLeads from "../components/RecentLeads";
import { useAuth } from "../context/AuthContext";

const AgentDashboard: React.FC = () => {
  const {name} = useAuth();
  const [activeComponent, setActiveComponent] = useState<
    "default" | "manageApplicants" | "managePolicies" | "showLeads"
  >("default");

  return (
    <div className="agent-dashboard">
      <img src={agentImage} alt="Agent" className="agent-image" />
      <div className="agent-dashboard-details">
        {activeComponent === "default" ? (
          <div className="agent-content">
            <h2>Welcome, {name || "Agent"}!</h2>
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
              <button
                className="admin-btn"
                onClick={() => setActiveComponent("showLeads")}
              >
                Show Leads
              </button>
            </div>
            <div className="appointment-slot-section">
              <AppointmentSlot />
            </div>
          </div>
        ) : activeComponent === "manageApplicants" ? (
          <ManageSlots onBack={() => setActiveComponent("default")} />
        ) : activeComponent === "managePolicies" ? (
          <ManagePolicies
            onBack={() => setActiveComponent("default")}
            onUpdate={(policyId: string) => {
              console.log("Update policy:", policyId);
            }}
            onAdd={() => {
              console.log("Add policy");
            }}
            onDelete={(policyId: string) => {
              console.log("Delete policy:", policyId);
            }}
          />
        ) : activeComponent === "showLeads" ? (
          <RecentLeads onBack={() => setActiveComponent("default")} />
        ) : null}
      </div>
    </div>
  );
};

export default AgentDashboard;
