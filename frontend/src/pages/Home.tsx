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

const Home = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<
    "policies" | "careers" | null
  >(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const navigate = useNavigate();

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
              <button
                className="home-button"
                onClick={() => handleButtonClick("policies")}
              >
                Explore Policies
              </button>
              <button
                className="home-button"
                onClick={() => handleButtonClick("careers")}
              >
                Become an Agent
              </button>
            </div>
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

        <div className="services-section">
          <h2 className="services-title">Services We Provide</h2>
          <div className="services-logos">
            <img src={StarLogo} alt="Star Health" className="service-logo" />
            <img src={LicLogo} alt="LIC" className="service-logo" />
            <img src={CareLogo} alt="Care Health" className="service-logo" />
          </div>
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
