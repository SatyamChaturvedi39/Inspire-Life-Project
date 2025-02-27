import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManagePolicies.css";
import PolicyFormPopup, { PolicyFormData } from "./PolicyFormPopup";

interface Policy {
  _id: string;
  policyDescription:string;
  policyName: string;
  companyName: string;
  ageRange: string;
  shortDescription: string;
  // Other fields may be present but aren't used in this component
}

interface ManagePoliciesProps {
    onBack: () => void;
    onAdd: () => void;
    onDelete: (policyId: string) => void;
    onUpdate: (policyId: string) => void;
  }

const ManagePolicies: React.FC<ManagePoliciesProps> = ({ onBack }) => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMode, setPopupMode] = useState<"create" | "update">("create");
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/policies", {
        params: { limit: 15, offset: 0 },
      });
      console.log("Fetched policies:", response.data.data);
      setPolicies(response.data.data);
    } catch (error) {
      console.error("Error fetching policies:", error);
    }
  };

  const handleAddClick = () => {
    setPopupMode("create");
    setSelectedPolicy(null);
    setShowPopup(true);
  };

  const handleUpdateClick = (policy: Policy) => {
    setPopupMode("update");
    setSelectedPolicy(policy);
    setShowPopup(true);
  };

  const handleDeletePolicy = async (policyId: string) => {
    try {
      console.log("Deleting policy:", policyId);
      await axios.delete(`http://localhost:5001/api/policies/${policyId}`);
      setPolicies(policies.filter((policy) => policy._id !== policyId));
    } catch (error) {
      console.error("Error deleting policy:", error);
    }
  };

  const handlePopupSubmit = async (formData: PolicyFormData) => {
    try {
      if (popupMode === "create") {
        console.log("Creating policy with data:", formData);
        await axios.post("http://localhost:5001/api/policies", formData);
      } else if (popupMode === "update" && selectedPolicy) {
        // Generate slug from selectedPolicy's policyName
        const slug = selectedPolicy.policyName
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
        console.log("Updating policy with slug:", slug, "and data:", formData);
        await axios.put(`http://localhost:5001/api/policies/${slug}`, formData);
      }
      fetchPolicies();
    } catch (error) {
      console.error("Error in popup submit:", error);
    } finally {
      setShowPopup(false);
    }
  };

  // Toggle delete mode when DELETE header button is clicked
  const handleToggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
  };

  return (
    <div className="manage-policies-container">
      <div className="manage-policies-header">
        <div className="manage-policies-back-button" onClick={onBack}>
          ← back
        </div>
        <div className="manage-policies-header-section">
          <h2 className="manage-policies-header-title">Manage Policies</h2>
          <div className="manage-policies-header-actions">
            <button className="manage-policies-add-button" onClick={handleAddClick}>
              ADD
            </button>
            <button className="manage-policies-delete-button" onClick={handleToggleDeleteMode}>
              DELETE
            </button>
          </div>
        </div>
      </div>
      
      <div className="manage-policies-list">
        {policies && policies.length > 0 ? (
          policies.map((policy) => (
            <div key={policy._id} className="manage-policies-policy-card">
              {deleteMode && (
                <div
                  className="manage-policies-delete-icon"
                  onClick={() => handleDeletePolicy(policy._id)}
                >
                  ×
                </div>
              )}
              <div className="manage-policies-policy-info">
                <h3 className="manage-policies-policy-name">{policy.policyName}</h3>
                <p className="manage-policies-policy-company">{policy.companyName}</p>
                <p className="manage-policies-policy-age">{policy.ageRange}</p>
                <p className="manage-policies-policy-short-description">{policy.shortDescription}</p>
              </div>
              <button
                className="manage-policies-update-button"
                onClick={() => handleUpdateClick(policy)}
              >
                UPDATE
              </button>
            </div>
          ))
        ) : (
          <p className="manage-policies-no-policies">No policies found.</p>
        )}
      </div>
      
      {showPopup && (
        <PolicyFormPopup
          mode={popupMode}
          initialData={
            selectedPolicy
              ? {
                  policyName: selectedPolicy.policyName,
                  policyDescription: selectedPolicy.policyDescription, // Pre-fill with full description
                  companyName: selectedPolicy.companyName,
                  ageRange: selectedPolicy.ageRange,
                  shortDescription: selectedPolicy.shortDescription,
                  keyFeatures: {} // Optionally, prefill if you have keyFeatures data
                }
              : undefined
          }
          onClose={() => setShowPopup(false)}
          onSubmit={handlePopupSubmit}
        />
      )}
    </div>
  );
};

export default ManagePolicies;