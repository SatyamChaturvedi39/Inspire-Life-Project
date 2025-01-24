import "bootstrap/dist/css/bootstrap.min.css";
import Image from "../assets/Image.png";
import LicLogo from "../assets/liclogo.png";
import StarLogo from "../assets/starlogo.png";
import CareLogo from "../assets/carelogo.png";
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

export default Hero;
