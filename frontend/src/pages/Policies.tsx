import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Policies.css";
import policyImage from "../assets/policy.jpg";
import bookslot from "../assets/bookslot.png"; // Book-a-slot image
import SlotForm from "../components/SlotForm";

interface Policy {
  _id: string;
  policyName: string;
  companyName: string;
  ageRange: string;
  shortDescription: string;
}

const PolicyPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const searchParam = params.get("search") || "";
  
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [filteredPolicies, setFilteredPolicies] = useState<Policy[]>([]);
  const [showSlotForm, setShowSlotForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch policies on mount
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/policies`, {
          params: { offset: 0 },
        });
        setPolicies(response.data.data);
        setFilteredPolicies(response.data.data);
      } catch (error) {
        console.error("Error fetching policies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, []);

  // Filter policies based on search query using startsWith and includes
  useEffect(() => {
    if (searchQuery === "") {
      setFilteredPolicies(policies);
    } else {
      const lowerSearch = searchQuery.toLowerCase();
      const filtered = policies.filter((policy) =>
        policy.policyName.toLowerCase().startsWith(lowerSearch) ||
        policy.companyName.toLowerCase().startsWith(lowerSearch) ||
        policy.ageRange.toLowerCase().includes(lowerSearch)
      );
      setFilteredPolicies(filtered);
    }
  }, [searchQuery, policies]);

  const handleViewDetails = (policy: Policy) => {
    const slug = policy.policyName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    navigate(`/policies/${slug}`);
  };

  return (
    <div className="policy-container">
      <div className="policies-hero-image-container">
        <img src={policyImage} alt="Insurance Services" className="policies-hero-image" />
      </div>

      {/* Container for search bar and book slot image */}
      <div className="search-image-container">
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
        <div className="book-slot-container">
          <img
            src={bookslot}
            alt="Book Appointment"
            className="book-slot-image"
            onClick={() => setShowSlotForm(true)}
          />
        </div>
      </div>

      {/* Loading part */}
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Loading policies, please wait...</p>
        </div>
      ) : (
        <div className="policy-cards-container">
          {filteredPolicies.length > 0 ? (
            filteredPolicies.map((policy) => (
              <div key={policy._id} className="policy-card">
                <h3 className="policy-name">{policy.policyName}</h3>
                <p className="policy-company">
                  <strong>{policy.companyName}</strong>
                </p>
                <p className="policy-age">
                  <strong>{policy.ageRange}</strong>
                </p>
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
      )}

      {showSlotForm && (
        <SlotForm meetingType="policy" onClose={() => setShowSlotForm(false)} />
      )}
    </div>
  );
};

export default PolicyPage;
