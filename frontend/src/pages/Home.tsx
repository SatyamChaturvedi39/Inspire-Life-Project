import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "../assets/Image.jpg";
import LicLogo from "../assets/liclogo.png";
import StarLogo from "../assets/starlogo.png";
import CareLogo from "../assets/carelogo.png";
import chatbot from "../assets/chatbot.png";
import "./Home.css";
import CarouselScroll from "../components/CarouselScroll";
import Popup from "../components/LeadFormPopup";
import LeadForm from "../components/LeadForm";
import InsuranceChatbot from "../components/InsuranceChatbot";
import Stats from "../components/Stats";
import axios from "axios";

const Home = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<"policies" | "careers" | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const navigate = useNavigate();

  // Initial dummy request for backend warmup
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/dummy`)
      .catch((err) => console.error("Backend warmup failed:", err));
  }, []);

  // NEW: Periodic Visitor Tracking every 5 minutes (300,000 milliseconds)
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/stats/track`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        console.error("Failed to track visitor:", err);
      }
    };

    // Call immediately on page load
    trackVisitor();

    // Set up interval to call every 5 minutes (if user remains on the page)
    const visitorInterval = setInterval(() => {
      trackVisitor();
    }, 5 * 60 * 1000);

    return () => clearInterval(visitorInterval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleButtonClick = (action: "policies" | "careers") => {
    setSelectedAction(action);
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setSelectedAction(null);
  };

  const handleFormSubmit = () => {
    if (selectedAction) {
      navigate(`/${selectedAction}`);
    }
    setIsPopupOpen(false);
    setSelectedAction(null);
  };

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <>
      <div className="home-container">
        <div className="home-image-container">
          <img src={Image} alt="home Image" className="home-image" />
          {!isDesktop && <h1 className="question">How can we help you?</h1>}
          <div className="main-content-container">
            {isDesktop && <h1 className="question">How can we help you?</h1>}
            <div className="button-container">
              <button className="home-button" onClick={() => handleButtonClick("policies")}>
                Explore Policies
              </button>
              <button className="home-button" onClick={() => handleButtonClick("careers")}>
                Become an Agent
              </button>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="services-section">
          <h2 className="services-title">Services We Provide</h2>
          <div className="services-logos">
            <img src={StarLogo} alt="Star Health" className="service-logo" />
            <img src={LicLogo} alt="LIC" className="service-logo" />
            <img src={CareLogo} alt="Care Health" className="service-logo" />
          </div>
        </div>

        {isDesktop ? (
          <>
            <LeadForm />
            <h1>
              <a className="know-more-home" href="/about-us">
                Know More!
              </a>
            </h1>
            <CarouselScroll />
          </>
        ) : (
          <>
            <CarouselScroll />
            <h1>
              <a className="know-more-home" href="/about-us">
                Know More!
              </a>
            </h1>
            <LeadForm />
          </>
        )}

        {isPopupOpen && (
          <Popup
            onClose={handlePopupClose}
            onSubmit={handleFormSubmit}
            selectedAction={selectedAction}
          />
        )}

        {/* Dynamic Stats Carousel */}
        <div className="stats-carousel-section">
          <Stats />
        </div>
      </div>

      {/* Chatbot fixed at bottom right */}
      <div className="chatbot-launcher">
        <div className="chatbot-button" onClick={toggleChatbot}>
          <img src={chatbot} alt="Chatbot" className="chatbot-icon" />
        </div>
        <div className="chatbot-label">Hey, I am your Live Chat, Raksha!</div>
      </div>

      {/* Chatbot Popup */}
      {isChatbotOpen && (
        <div className="chatbot-popup">
          <div className="chatbot-header">
            <div className="chatbot-title">Chat with Raksha</div>
            <button className="chatbot-close-btn" onClick={toggleChatbot}>
              ✖
            </button>
          </div>
          <div className="chatbot-popup-content">
            <InsuranceChatbot />
          </div>
        </div>
      )}
    </>
  );
};

export default Home;