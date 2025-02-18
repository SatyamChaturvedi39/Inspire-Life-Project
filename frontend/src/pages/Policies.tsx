import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Policies.css";
import policyImage from "../assets/policy.jpg";

// Define Policy Interface
interface Policy {
  _id: string;
  policyName: string;
  companyName: string;
  ageRange: string;
  shortDescription: string;
}

const PolicyPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [filteredPolicies, setFilteredPolicies] = useState<Policy[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/policies");
        setPolicies(response.data.data);
        setFilteredPolicies(response.data.data);
      } catch (error) {
        console.error("Error fetching policies:", error);
      }
    };

    fetchPolicies();
  }, []);

  useEffect(() => {
    const filtered = policies.filter((policy) =>
      policy.policyName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPolicies(filtered);
  }, [searchQuery, policies]);

  const handleViewDetails = (policy: Policy) => {
    const slug = policy.policyName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, ""); //Ensures consistent slug format
  
    navigate(`/policy/${slug}`);
  };

  return (
    <div className="policy-container">
      <div className="policies-hero-image-container">
        <img src={policyImage} alt="Insurance Services" className="policies-hero-image" />
      </div>

      <div className="search-container">
        <div className="search-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="policy-cards-container">
        {filteredPolicies.length > 0 ? (
          filteredPolicies.map((policy) => (
            <div key={policy._id} className="policy-card">
              <h3 className="policy-name">{policy.policyName}</h3>
              <p className="policy-company"><strong>{policy.companyName}</strong></p>
              <p className="policy-age"><strong>{policy.ageRange}</strong></p>
              <p className="policy-details">{policy.shortDescription}</p>
              <button className="policy-button" onClick={() => handleViewDetails(policy)}>
                Know More
              </button>
            </div>
          ))
        ) : (
          <p className="no-policies">No policies found.</p>
        )}
      </div>
    </div>
  );
};

export default PolicyPage;
