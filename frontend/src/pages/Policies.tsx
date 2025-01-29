import React, { useState } from 'react';
import { Search } from 'lucide-react';
import './Policies.css'
import policy from '../assets/policy.jpg';

const PolicyPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="policy-container">
      {/* Hero Image Section */}
      <div className="policies-hero-image-container">
        <img 
          src={policy}
          alt="Insurance Services"
          className="policies-hero-image"
        />
      </div>

      {/* Search Section */}
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

      {/* Policy Cards Section */}
      <div className="policy-cards-container">
        <div className="policy-card">
          <h3 className="policy-name">Policy #209</h3>
          <p className="policy-details">lorem ipsum lorem ipsum lorem ipsum</p>
        </div>
        <div className="policy-card">
          <h3 className="policy-name">Policy #210</h3>
          <p className="policy-details">lorem ipsum lorem ipsum lorem ipsum</p>
        </div>
        <div className="policy-card">
          <h3 className="policy-name">Policy #209</h3>
          <p className="policy-details">lorem ipsum lorem ipsum lorem ipsum</p>
        </div>
        <div className="policy-card">
          <h3 className="policy-name">Policy #209</h3>
          <p className="policy-details">lorem ipsum lorem ipsum lorem ipsum</p>
        </div>
        <div className="policy-card">
          <h3 className="policy-name">Policy #209</h3>
          <p className="policy-details">lorem ipsum lorem ipsum lorem ipsum</p>
        </div>
        <div className="policy-card">
          <h3 className="policy-name">Policy #209</h3>
          <p className="policy-details">lorem ipsum lorem ipsum lorem ipsum</p>
        </div>
        {/* Add more policy cards here */}
      </div>
    </div>
  );
};

export default PolicyPage;