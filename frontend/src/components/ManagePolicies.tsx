import React, { useState, useEffect } from "react";
import "./ManagePolicies.css";
import PolicyFormPopup, { PolicyFormData } from "./PolicyFormPopup";
import { useAxiosInstance } from "../context/axiosInstance";
import { useAuth } from "../context/AuthContext"; // Import auth to get current user info

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
  createdBy?: string; // Optional field indicating the creator's ID
}

interface ManagePoliciesProps {
  onBack: () => void;
  onAdd: () => void;
  onDelete: (policyId: string) => void;
  onUpdate: (policyId: string) => void;
}

const ManagePolicies: React.FC<ManagePoliciesProps> = ({ onBack, onAdd, onDelete, onUpdate }) => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMode, setPopupMode] = useState<"create" | "update">("create");
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [policyToDelete, setPolicyToDelete] = useState<string | null>(null);

  const axiosInstance = useAxiosInstance();
  const { id: currentUserId, role } = useAuth(); // Get the logged-in user id and role

  useEffect(() => {
    fetchPolicies();
  }, []);

  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPopup]);

  const fetchPolicies = async () => {
    try {
      const response = await axiosInstance.get("/policies", {
        params: { offset: 0 },
      });
      console.log("Fetched policies:", response.data.data);
      setPolicies(response.data.data);
    } catch (error) {
      console.error("Error fetching policies:", error);
    }
  };

  const generateSlug = (policyName: string) => {
    return policyName.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  };

  const handleAddClick = () => {
    onAdd();
    setPopupMode("create");
    setSelectedPolicy(null);
    setShowPopup(true);
  };

  const handleUpdateClick = (policy: Policy) => {
    // If the current user is an agent and did not create the policy, show an alert.
    if (role === "agent" && policy.createdBy && policy.createdBy !== currentUserId) {
      alert("You are not authorized to update this policy as it was not created by you.");
      return;
    }
    setPopupMode("update");
    setSelectedPolicy(policy);
    setShowPopup(true);
  };

  const confirmDeletePolicy = (policyId: string) => {
    setPolicyToDelete(policyId);
    setShowConfirmDialog(true);
  };

  const handleDeletePolicy = async () => {
    if (!policyToDelete) return;
    try {
      const policy = policies.find((p) => p._id === policyToDelete);
      if (policy) {
        // If the user is an agent, allow deletion only if they created the policy
        if (role === "agent" && policy.createdBy && policy.createdBy !== currentUserId) {
          alert("You are not authorized to delete this policy as it was not created by you.");
          setShowConfirmDialog(false);
          setPolicyToDelete(null);
          setDeleteMode(false);
          return;
        }
        
        const slug = generateSlug(policy.policyName);
        console.log("Deleting policy with slug:", slug);
        await axiosInstance.delete(`/policies/${slug}`);
        setPolicies(policies.filter((p) => p._id !== policyToDelete));
        onDelete(policyToDelete);
      }
    } catch (error) {
      console.error("Error deleting policy:", error);
    } finally {
      setShowConfirmDialog(false);
      setPolicyToDelete(null);
      setDeleteMode(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setPolicyToDelete(null);
    setDeleteMode(false);
  };

  const handlePopupSubmit = async (formData: PolicyFormData) => {
    try {
      if (popupMode === "create") {
        console.log("Creating policy with data:", formData);
        await axiosInstance.post("/policies", formData);
      } else if (popupMode === "update" && selectedPolicy) {
        const slug = generateSlug(selectedPolicy.policyName);
        console.log("Updating policy with slug:", slug, "and data:", formData);
        await axiosInstance.put(`/policies/${slug}`, formData);
        onUpdate(selectedPolicy._id);
      }
      fetchPolicies();
    } catch (error) {
      console.error("Error in popup submit:", error);
    } finally {
      setShowPopup(false);
    }
  };

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
                  policyDescription: selectedPolicy.policyDescription,
                  companyName: selectedPolicy.companyName,
                  ageRange: selectedPolicy.ageRange,
                  shortDescription: selectedPolicy.shortDescription,
                  keyFeatures: selectedPolicy.keyFeatures || {},
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
            <p>
              Are you sure you want to delete this policy?
              <br />
              This action cannot be undone.
            </p>
            <div className="delete-confirm-actions">
              <button className="delete-confirm-yes" onClick={handleDeletePolicy}>
                Yes
              </button>
              <button className="delete-confirm-no" onClick={cancelDelete}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePolicies;