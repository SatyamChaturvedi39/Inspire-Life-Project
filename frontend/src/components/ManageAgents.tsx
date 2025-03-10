import React, { useState, useEffect } from "react";
import "./ManageAgents.css";
import { useAxiosInstance } from "../context/axiosInstance";

interface Agent {
  _id: string;
  name: string;
  email: string;
  password: string;
}

interface ManageAgentsProps {
  onBack: () => void;
}

const ManageAgents: React.FC<ManageAgentsProps> = ({ onBack }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMode, setPopupMode] = useState<"create" | "update">("create");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<string | null>(null);
  
  const axiosInstance = useAxiosInstance();

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await axiosInstance.get("/agents");
      setAgents(response.data.data);
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  const handleAddClick = () => {
    setPopupMode("create");
    setFormData({ name: "", email: "", password: "" });
    setSelectedAgentId(null);
    setShowPopup(true);
    setShowPassword(false);
  };

  const handleUpdateClick = (agent: Agent) => {
    // For update, pre-fill name and email; leave password empty.
    setPopupMode("update");
    setFormData({ name: agent.name, email: agent.email, password: "" });
    setSelectedAgentId(agent._id);
    setShowPopup(true);
    setShowPassword(false);
  };

  // Instead of directly deleting, show a confirm dialogue.
  const handleDeleteClick = (agentId: string) => {
    setAgentToDelete(agentId);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (agentToDelete) {
      try {
        await axiosInstance.delete(`/agents/${agentToDelete}`);
        setAgents((prevAgents) => prevAgents.filter((agent) => agent._id !== agentToDelete));
      } catch (error) {
        console.error("Error deleting agent:", error);
      } finally {
        setShowConfirmDialog(false);
        setAgentToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setAgentToDelete(null);
  };

  const handlePopupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (popupMode === "create") {
        await axiosInstance.post("/agents", formData);
      } else if (popupMode === "update" && selectedAgentId) {
        await axiosInstance.put(`/agents/${selectedAgentId}`, formData);
      }
      fetchAgents();
      setShowPopup(false);
    } catch (error) {
      console.error("Error in popup submit:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="manage-agents-container">
      <div className="manage-agents-header">
        <button onClick={onBack} className="manage-agents-back-button">BACK</button>
        <h2><center>Manage Agents</center></h2>
        <button className="manage-agents-add-button" onClick={handleAddClick}>ADD</button>
      </div>

      <div className="manage-agents-list">
        {agents.length > 0 ? (
          agents.map((agent) => (
            <div key={agent._id} className="manage-agents-agent-card">
              <div className="manage-agents-agent-info">
                <h3 className="manage-agents-agent-name">{agent.name}</h3>
                <p className="manage-agents-agent-email">Email: {agent.email}</p>
              </div>
              <div className="manage-agents-agent-actions">
                <button className="manage-agents-update-button" onClick={() => handleUpdateClick(agent)}>
                  UPDATE
                </button>
                <button className="manage-agents-delete-button" onClick={() => handleDeleteClick(agent._id)}>
                  DELETE
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="manage-agents-no-agents">No agents found.</p>
        )}
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>{popupMode === "create" ? "Add Agent" : "Update Agent"}</h2>
            <form onSubmit={handlePopupSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </label>
              <label>
                Password:
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={popupMode === "update" ? "New Password" : ""}
                    required={popupMode === "create"}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    style={{ marginLeft: "5px", padding: "4px 8px", background:"#0c2641", color:"#ffffff", borderRadius:"4px" }}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </label>
              <div className="popup-buttons">
                <button type="submit">{popupMode === "create" ? "Add" : "Update"}</button>
                <button type="button" onClick={() => setShowPopup(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConfirmDialog && (
        <div className="delete-confirm-dialog">
          <div className="delete-confirm-box">
            <p>Are you sure you want to delete this agent account?</p>
            <div className="delete-confirm-actions">
              <button className="delete-confirm-yes" onClick={confirmDelete}>Yes</button>
              <button className="delete-confirm-no" onClick={cancelDelete}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAgents;
