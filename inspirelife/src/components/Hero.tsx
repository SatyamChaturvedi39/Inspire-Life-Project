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
      <CarouselScroll /> {/* Add the Carousel component */}
      <h1 className="know-more">Know More</h1>
      <LeadForm />
    </div>
  );
};

export default Hero;
