import React, { useState, useEffect } from "react";
import "./ManageClients.css";
import PolicyPopup from "../components/PolicyPopup";

interface PolicyData {
  id: string;
  name: string;
  details: string;
}

interface ManageClientsProps {
  onBack: () => void;
}

const ManageClients: React.FC<ManageClientsProps> = ({ onBack }) => {
  const [policies, setPolicies] = useState<PolicyData[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyData | null>(null);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/policies");
        if (!response.ok) {
          throw new Error("Failed to fetch policies");
        }
        
        const data = await response.json();
        console.log("Fetched policies:", data); // Debugging log

        if (Array.isArray(data)) {
          setPolicies(data); // Ensure policies is an array
        } else {
          console.error("Unexpected response format:", data);
          setPolicies([]); // Prevent crash
        }
      } catch (error) {
        console.error("Error fetching policies:", error);
        setPolicies([]); // Ensure policies is always an array
      }
    };

    fetchPolicies();
  }, []);

  const handlePolicyClick = (policy: PolicyData) => {
    setSelectedPolicy(policy);
  };

  return (
    <div className="manage-clients">
      <button className="back-btn" onClick={onBack}>
        &#x21E6; Back
      </button>
      <h2>Manage Clients</h2>
      <div className="policy-list">
        {policies.length > 0 ? (
          policies.map((policy) => (
            <div
              key={policy.id}
              className="policy-item"
              onClick={() => handlePolicyClick(policy)}
            >
              {policy.name}
            </div>
          ))
        ) : (
          <p>Loading policies or no policies available.</p>
        )}
      </div>
      {selectedPolicy && (
        <PolicyPopup policyName={selectedPolicy.name} onClose={() => setSelectedPolicy(null)} />
      )}
    </div>
  );
};

export default ManageClients;