// Only change the visitor count logic and leave everything else untouched
import React, { useState, useEffect } from "react";
import "./Stats.css";

const Stats: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visitorCount, setVisitorCount] = useState<number>(0); // default 0

  // Fetch real visitor count from backend
  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/stats/visitors`
        );
        const data = await response.json();
        setVisitorCount(data.count);
      } catch (error) {
        console.error("Failed to fetch visitor count:", error);
      }
    };

    fetchVisitorCount();
    const interval = setInterval(fetchVisitorCount, 15000); // refresh every 15s
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

  const getPrevIndex = (index: number) =>
    (index - 1 + stats.length) % stats.length;
  const getNextIndex = (index: number) => (index + 1) % stats.length;

  const handleCardClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="stats-container">
      <div className="stats-carousel">
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

        <div className="stats-card stats-card-active">
          <div className="stats-title">{stats[activeIndex].title}</div>
          <div className="stats-value stats-value-active">
            {stats[activeIndex].format(stats[activeIndex].value)}
          </div>
        </div>

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