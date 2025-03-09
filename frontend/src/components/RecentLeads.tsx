import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RecentLeads.css";

interface Lead {
  _id: string;
  name: string;
  phoneNumber: string;
  email: string;
  comment: string;
  createdAt: string;
}

interface RecentLeadsProps {
  onBack: () => void;
}

const RecentLeads: React.FC<RecentLeadsProps> = ({ onBack }) => {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const fetchRecentLeads = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/leads/recent", {
          withCredentials: true,
        });
        console.log("Fetched recent leads:", response.data.data);
        setLeads(response.data.data);
      } catch (error) {
        console.error("Error fetching recent leads:", error);
      }
    };

    fetchRecentLeads();
  }, []);

  return (
    <div className="recent-leads-container">
      <div className="recent-leads-header">
        <div className="recent-leads-back-button" onClick={onBack}>
          &#x21E6; Back
        </div>
        <h2 className="recent-leads-title">Recent Leads (Past 7 Days)</h2>
      </div>
      <div className="recent-leads-list">
        {leads.length > 0 ? (
          leads.map((lead) => (
            <div key={lead._id} className="recent-lead-card">
              <h3 className="recent-lead-name">{lead.name}</h3>
              <p className="recent-lead-phone">
                <strong>Phone:</strong> {lead.phoneNumber}
              </p>
              <p className="recent-lead-email">
                <strong>Email:</strong> {lead.email}
              </p>
              <p className="recent-lead-comment">
                <strong>Comment:</strong> {lead.comment}
              </p>
              <p className="recent-lead-date">
                <strong>Date:</strong> {new Date(lead.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="recent-leads-no-leads">No leads found in the past week.</p>
        )}
      </div>
    </div>
  );
};

export default RecentLeads;