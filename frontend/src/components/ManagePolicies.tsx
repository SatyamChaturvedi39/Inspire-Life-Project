import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManagePolicies.css";
import PolicyFormPopup, { PolicyFormData } from "./PolicyFormPopup";

interface KeyFeatures {
  policyTerm?: string;
  ageCriteria?: string;
  coverageDetails?: string;
  sumAssuredRange?: string;
  taxBenefit?: string;
}

interface Policy {
  _id: string;
  policyDescription: string;
  policyName: string;
  companyName: string;
  ageRange: string;
  shortDescription: string;
  keyFeatures?: KeyFeatures;
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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [policyToDelete, setPolicyToDelete] = useState<string | null>(null);


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

  const confirmDeletePolicy = (policyId: string) => {
    setPolicyToDelete(policyId);
    setShowConfirmDialog(true);
  };

  const generateSlug = (policyName: string) => {
    return policyName.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  };
  
  const handleDeletePolicy = async () => {
    if (!policyToDelete) return;
    try {
      // Use slug for deletion, not _id
      const policy = policies.find((p) => p._id === policyToDelete);
      if (policy) {
        const slug = generateSlug(policy.policyName);
        await axios.delete(`http://localhost:5001/api/policies/${slug}`);
        setPolicies(policies.filter((p) => p._id !== policyToDelete));
      }
    } catch (error) {
      console.error("Error deleting policy:", error);
    } finally {
      setShowConfirmDialog(false);
      setPolicyToDelete(null);
    }
  };
  

  const handlePopupSubmit = async (formData: PolicyFormData) => {
    try {
      if (popupMode === "create") {
        console.log("Creating policy with data:", formData);
        await axios.post("http://localhost:5001/api/policies", formData);
      } else if (popupMode === "update" && selectedPolicy) {
        // Generate slug from selectedPolicy's policyName
        const slug = generateSlug(selectedPolicy.policyName);
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
        &#x21E6; Back
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
                onClick={() => confirmDeletePolicy(policy._id)}
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
                  keyFeatures: selectedPolicy.keyFeatures || {}
                }
              : undefined
          }
          onClose={() => setShowPopup(false)}
          onSubmit={handlePopupSubmit}
        />
      )}

      {showConfirmDialog && (
        <div className="delete-confirm-dialog">
          <div className="delete-confirm-box">
            <p>Are you sure you want to delete this policy?<br></br> This action cannot be undone.</p>
            <div className="delete-confirm-actions">
              <button className="delete-confirm-yes" onClick={handleDeletePolicy}>Yes</button>
              <button className="delete-confirm-no" onClick={() => setShowConfirmDialog(false)}>No</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManagePolicies;