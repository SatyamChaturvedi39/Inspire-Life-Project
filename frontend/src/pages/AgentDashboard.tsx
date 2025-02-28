import React, { useState } from "react";
import "./AgentDashboard.css";
import agentImage from "../assets/adminimage.jpg";
import ManageSlots from "../components/ManageSlots";
import ManagePolicies from "../components/ManagePolicies";

const AgentDashboard: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<
    "default" | "manageSlots" | "managePolicies"
  >("default");

  return (
    <div className="agent-dashboard">
      <img src={agentImage} alt="Agent" className="agent-image" />
      <div className="agent-dashboard-details">
      {activeComponent === "default" ? (
        <div className="agent-content">
          <h2>Welcome, Satyam!</h2>
          <div className="agent-buttons">
            <button 
              className="agent-btn" 
              onClick={() => setActiveComponent("managePolicies")}
            >
              Manage Policies
            </button>
            <button
              className="agent-btn"
              onClick={() => setActiveComponent("manageSlots")}
            >
              Manage Appointments
            </button>
          </div>
          
        </div>
      ) : activeComponent === "manageSlots" ? (
        <ManageSlots onBack={() => setActiveComponent("default")} />
      ) : (
        <ManagePolicies 
          onBack={() => setActiveComponent("default")} 
          onUpdate={(policyId: string) => { console.log("Update policy:", policyId); }} 
          onAdd={() => { console.log("Add policy"); }} 
          onDelete={() => { console.log("Delete policy"); }} 
        />
      )}
      </div>
    </div>
  );
};

export default AgentDashboard;