import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "../assets/Image.jpg";
import LicLogo from "../assets/liclogo.png";
import StarLogo from "../assets/starlogo.png";
import CareLogo from "../assets/carelogo.png";
import "./Home.css";
import CarouselScroll from "../components/CarouselScroll";
import Popup from "../components/PopUp";
import LeadForm from "../components/LeadForm";

const Home = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<
    "policies" | "careers" | null
  >(null);
  const [isDesktop, setIsDesktop] = useState(false);
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

  return (
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
  );
};

export default Home;
