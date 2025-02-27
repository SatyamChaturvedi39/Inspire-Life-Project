import React, { useState, useEffect } from "react";
import "./PolicyFormPopup.css";

interface KeyFeatures {
  policyTerm?: string;
  ageCriteria?: string;
  coverageDetails?: string;
  sumAssuredRange?: string;
  taxBenefit?: string;
}

export interface PolicyFormData {
  policyName: string;
  policyDescription: string;
  companyName: string;
  ageRange: string;
  shortDescription: string;
  keyFeatures: KeyFeatures;
}

interface PolicyFormPopupProps {
  mode: "create" | "update";
  initialData?: PolicyFormData;
  onClose: () => void;
  onSubmit: (data: PolicyFormData) => void;
}

const PolicyFormPopup: React.FC<PolicyFormPopupProps> = ({ mode, initialData, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<PolicyFormData>({
    policyName: "",
    policyDescription: "",
    companyName: "",
    ageRange: "",
    shortDescription: "",
    keyFeatures: {
      policyTerm: "",
      ageCriteria: "",
      coverageDetails: "",
      sumAssuredRange: "",
      taxBenefit: ""
    }
  });

  useEffect(() => {
    if (mode === "update" && initialData) {
      setFormData(initialData);
    }
  }, [mode, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Check if the field belongs to keyFeatures
    if (name in formData.keyFeatures) {
      setFormData(prev => ({
        ...prev,
        keyFeatures: { ...prev.keyFeatures, [name]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="policy-form-popup-overlay">
      <div className="policy-form-popup">
        <h2>{mode === "create" ? "Create Policy" : "Update Policy"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="policyName"
            placeholder="Policy Name"
            value={formData.policyName}
            onChange={handleChange}
            required
          />
          <textarea
            name="policyDescription"
            placeholder="Policy Description"
            value={formData.policyDescription}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="ageRange"
            placeholder="Age Range (e.g., 18-60)"
            value={formData.ageRange}
            onChange={handleChange}
            required
          />
          <textarea
            name="shortDescription"
            placeholder="Short Description"
            value={formData.shortDescription}
            onChange={handleChange}
            required
          />
          <h3>Key Features & Benefits</h3>
          <input
            type="text"
            name="policyTerm"
            placeholder="Policy Term"
            value={formData.keyFeatures.policyTerm || ""}
            onChange={handleChange}
          />
          <input
            type="text"
            name="ageCriteria"
            placeholder="Age Criteria"
            value={formData.keyFeatures.ageCriteria || ""}
            onChange={handleChange}
          />
          <input
            type="text"
            name="coverageDetails"
            placeholder="Coverage Details"
            value={formData.keyFeatures.coverageDetails || ""}
            onChange={handleChange}
          />
          <input
            type="text"
            name="sumAssuredRange"
            placeholder="Sum Assured Range"
            value={formData.keyFeatures.sumAssuredRange || ""}
            onChange={handleChange}
          />
          <input
            type="text"
            name="taxBenefit"
            placeholder="Tax Benefit"
            value={formData.keyFeatures.taxBenefit || ""}
            onChange={handleChange}
          />
          <div className="policy-form-popup-actions">
            <button type="submit" className="policy-form-submit-button">
              {mode === "create" ? "Create" : "Update"}
            </button>
            <button type="button" className="policy-form-cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PolicyFormPopup;