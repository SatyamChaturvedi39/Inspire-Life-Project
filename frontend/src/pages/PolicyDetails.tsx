import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import axios from "axios";
import "./PolicyDetails.css";

interface KeyFeatures {
  policyTerm?: string;
  ageCriteria?: string;
  coverageDetails?: string;
  sumAssuredRange?: string;
  taxBenefit?: string;
}

interface Policy {
  _id: string;
  policyName: string;
  policyDescription: string;
  companyName: string;
  ageRange: string;
  keyFeatures: KeyFeatures;
  agentId?: {
    name?: string;
    contact?: string;
  };
}

const PolicyDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>(); //Get slug from URL
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  
  useEffect(() => {
    if (!slug) {
      setError("Invalid policy request.");
      setLoading(false);
      return;
    }
    console.log("Slug in frontend:", slug);

    const fetchPolicyDetails = async () => {
      try {
        const url = `http://localhost:5001/api/policies/${slug}`;
        const response = await axios.get(url);
        setPolicy(response.data.data);
        
      } catch (error) {
        console.error("Error fetching policy details:", error);
        setError("Failed to load policy details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPolicyDetails();
  }, [slug]);

  return (
    <div className="policy-details-container">
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {policy && (
        <>
          <h1>{policy?.policyName}</h1>
          <p><strong>Company:</strong> {policy?.companyName}</p>
          <p><strong>Available for:</strong> {policy?.ageRange}</p>
          <p><strong>Description:</strong> {policy?.policyDescription}</p>
          <p><strong>Agent:</strong> {policy?.agentId?.name || "N/A"}</p>
          <p><strong>Contact:</strong> {policy?.agentId?.contact || "N/A"}</p>

          {/* Backend Logic for updating this still has to be made */}
          <h2>Key Features & Benefits</h2> 
          <div className="features-grid">
            <div className="feature-box"><strong>Policy Term:</strong> {policy.keyFeatures?.policyTerm}</div>
            <div className="feature-box"><strong>Age Criteria:</strong> {policy.keyFeatures?.ageCriteria}</div>
            <div className="feature-box"><strong>Coverage Details:</strong> {policy.keyFeatures?.coverageDetails}</div>
            <div className="feature-box"><strong>Sum Assured Range:</strong> {policy.keyFeatures?.sumAssuredRange}</div>
            <div className="feature-box"><strong>Tax Benefit:</strong> {policy.keyFeatures?.taxBenefit}</div>
          </div>
          
          <button className="contact-button">Contact for More Details</button>
        </>
      )}
    </div>
  );
};

export default PolicyDetails;
