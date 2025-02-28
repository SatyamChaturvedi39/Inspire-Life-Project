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
  const [suggestions, setSuggestions] = useState<Policy[]>([]); // For search suggestions
  const navigate = useNavigate();

  // Fetch only 15 policies from the backend
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/policies", {
          params: {
            limit: 15, // Fetch only 15 policies
            offset: 0, // Start from the first policy (you can change this to paginate)
          },
        });
        setPolicies(response.data.data);
        setFilteredPolicies(response.data.data);
      } catch (error) {
        console.error("Error fetching policies:", error);
      }
    };

    fetchPolicies();
  }, []);

  // Handle search input changes
  useEffect(() => {
    if (searchQuery) {
      // Filter policies for suggestions based on the search query
      const suggestedPolicies = policies.filter((policy) =>
        policy.policyName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(suggestedPolicies);
    } else {
      setSuggestions([]); // Clear suggestions if the search query is empty
    }
  }, [searchQuery, policies]);

  // Handle clicking a suggestion
  const handleSuggestionClick = (policy: Policy) => {
    setFilteredPolicies([policy]); // Show only the selected policy
    setSearchQuery(""); // Clear the search query
    setSuggestions([]); // Clear suggestions
  };

  // Handle viewing policy details
  const handleViewDetails = (policy: Policy) => {
    const slug = policy.policyName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, ""); // Ensures consistent slug format

    navigate(`/policies/${slug}`);
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

        {/* Display search suggestions */}
        {suggestions.length > 0 && (
          <div className="suggestions-container">
            {suggestions.map((policy) => (
              <div
                key={policy._id}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(policy)}
              >
                {policy.policyName}
              </div>
            ))}
          </div>
        )}
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