import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./PolicyDetails.css";
import policyImage from "../assets/policy.jpg";

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
  const { slug } = useParams<{ slug: string }>(); // Get slug from URL
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
      
  useEffect(() => {
    if (!slug) {
      setError("Invalid policy request.");
      setLoading(false);
      return;
    }
    
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
      {/* Full-width hero image */}
      <div className="policy-hero-image-container">
        <img src={policyImage} alt="Insurance Services" className="policy-hero-image" />
      </div>

      {loading && <div className="loading-container"><p>Loading...</p></div>}
      {error && <p className="error">{error}</p>}
      
      {policy && (
        <div className="policy-content">
          <h1 className="policy-title">{policy?.policyName}</h1>
          
          <div className="policy-info">
            <p><strong>Company:</strong> {policy?.companyName}</p>
            <p><strong>Available for:</strong> {policy?.ageRange}</p>
            <p><strong>Description:</strong> {policy?.policyDescription}</p>
          </div>
          
          <h2 className="features-title">Key Features & Benefits</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <p className="feature-title">Policy Term</p>
              <p className="feature-value">{policy.keyFeatures?.policyTerm}</p>
            </div>
            <div className="feature-card">
              <p className="feature-title">Age Criteria</p>
              <p className="feature-value">{policy.keyFeatures?.ageCriteria}</p>
            </div>
            <div className="feature-card">
              <p className="feature-title">Coverage Details</p>
              <p className="feature-value">{policy.keyFeatures?.coverageDetails}</p>
            </div>
            <div className="feature-card">
              <p className="feature-title">Sum Assured Range</p>
              <p className="feature-value">{policy.keyFeatures?.sumAssuredRange}</p>
            </div>
            <div className="feature-card">
              <p className="feature-title">Tax Benefit</p>
              <p className="feature-value">{policy.keyFeatures?.taxBenefit}</p>
            </div>           
          </div>
          <div className="dummy-text">
              <h3>Why Choose This Policy?</h3>
              <p>Get the best insurance services with our policy. Our policy offers a wide range of</p>
          </div>       
          <button className="contact-button">Contact for More Details</button>
        </div>
      )}
    </div>
  );
};

export default PolicyDetails;