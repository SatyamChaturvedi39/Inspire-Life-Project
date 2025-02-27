import React, { useState } from "react";
import "./AgentDashboard.css"; // Import CSS for styling
import agentImage from "../assets/adminimage.jpg"; // Import agent image
import ManageSlots from "../components/ManageSlots";

const AgentDashboard: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<
    "default" | "manageSlots"
  >("default");

  return (
    <div className="agent-dashboard">
      {/* Header image remains always */}
      <img src={agentImage} alt="Agent" className="agent-image" />

      {/* Conditionally render content below the image */}
      {activeComponent === "default" ? (
        <div className="agent-content">
          <h2>Welcome, Satyam!</h2>

          {/* Manage Buttons */}
          <div className="agent-buttons">
            <button className="agent-btn">Manage Policies</button>
            <button
              className="agent-btn"
              onClick={() => setActiveComponent("manageSlots")}
            >
              Manage Appointments
            </button>
          </div>
        </div>
      ) : (
        <ManageSlots onBack={() => setActiveComponent("default")} />
      )}
    </div>
  );
};

export default AgentDashboard;
