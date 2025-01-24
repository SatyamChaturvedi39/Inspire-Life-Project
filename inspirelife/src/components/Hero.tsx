import "bootstrap/dist/css/bootstrap.min.css";
import Image from "../assets/Image.png";
import "./Hero.css";
import CarouselScroll from "./CarouselScroll";
import LeadForm from "./LeadForm";

const Hero = () => {
  return (
    <div className="hero-container">
      <img src={Image} alt="Hero Image" className="hero-image" />
      <h1 className="question">How can we help you?</h1>
      <div className="button-container">
        <button className="hero-button">Buy a Policy</button>
        <button className="hero-button">Become an Agent</button>
      </div>
      <CarouselScroll />
      <h1 className="know-more">Know More</h1>
      <LeadForm />

      {/* New section for insurance services */}
      <div className="services-section">
        <h2 className="services-title">Services We Provide</h2>
        <div className="services-logos">
          {/* Placeholder for logo imports - you'll replace these with actual imported logos */}
          <img src="/path/to/ic-logo.png" alt="LIC" className="service-logo" />
          <img
            src="/path/to/star-health-logo.png"
            alt="Star Health"
            className="service-logo"
          />
          <img
            src="/path/to/other-insurance-logo.png"
            alt="Other Insurance"
            className="service-logo"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
