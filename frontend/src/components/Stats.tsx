import React, { useState, useEffect } from "react";
import "./Stats.css"; // Make sure to create this CSS file

const Stats: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visitorCount, setVisitorCount] = useState(10234);

  // Auto-rotate the carousel
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % stats.length);
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(rotationInterval);
  }, []);

  // Simulating visitor count change (in a real app this would come from an API)
  useEffect(() => {
    const interval = setInterval(() => {
      setVisitorCount((prev) => prev + Math.floor(Math.random() * 5) + 1);
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      title: "Number of Visitors",
      value: visitorCount,
      format: (val: number) => val.toLocaleString(),
    },
    {
      title: "Policies Sold",
      value: 5000,
      format: (val: number) => val.toLocaleString() + "+",
    },
    {
      title: "Number of Agents",
      value: 10,
      format: (val: number) => val.toLocaleString() + "+",
    },
  ];

  // Get previous and next indices for the carousel
  const getPrevIndex = (index: number) =>
    (index - 1 + stats.length) % stats.length;
  const getNextIndex = (index: number) => (index + 1) % stats.length;

  const handleCardClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="stats-container">
      <div className="stats-carousel">
        {/* Previous Card */}
        <div
          className="stats-card stats-card-side"
          onClick={() => handleCardClick(getPrevIndex(activeIndex))}
        >
          <div className="stats-title">
            {stats[getPrevIndex(activeIndex)].title}
          </div>
          <div className="stats-value">
            {stats[getPrevIndex(activeIndex)].format(
              stats[getPrevIndex(activeIndex)].value
            )}
          </div>
        </div>

        {/* Active Card (Center and Larger) */}
        <div className="stats-card stats-card-active">
          <div className="stats-title">{stats[activeIndex].title}</div>
          <div className="stats-value stats-value-active">
            {stats[activeIndex].format(stats[activeIndex].value)}
          </div>
        </div>

        {/* Next Card */}
        <div
          className="stats-card stats-card-side"
          onClick={() => handleCardClick(getNextIndex(activeIndex))}
        >
          <div className="stats-title">
            {stats[getNextIndex(activeIndex)].title}
          </div>
          <div className="stats-value">
            {stats[getNextIndex(activeIndex)].format(
              stats[getNextIndex(activeIndex)].value
            )}
          </div>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="stats-indicators">
        {stats.map((_, index) => (
          <div
            key={index}
            className={`stats-indicator ${
              index === activeIndex ? "stats-indicator-active" : ""
            }`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Stats;
