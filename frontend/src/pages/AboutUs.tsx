import React from 'react';
import './AboutUs.css';
import AboutUsImage from "../assets/AboutUsImage.png";

const AboutUs: React.FC = () => {
  return (
    <div className="about-container">  
      <div className="about-image-container">
        <img src={AboutUsImage} alt="Insurance Services" className="about-hero-image" />
      </div>
      <section className="about-section">
        <div className="about-content">
          <h2><b><center>About Us</center></b></h2>
          <p>
            At Inspire Life Insurance Solutions, we are dedicated to providing reliable 
            insurance solutions that protect what matters most to you. With years of 
            industry experience, we've built a reputation for trust, transparency, and 
            exceptional customer service. Our mission is to make insurance simple, 
            accessible, and tailored to the unique needs of every individual and 
            business we serve.
          </p>
          <p>
            We offer a range of insurance products, from life to health and business 
            coverage, ensuring that our clients have peace of mind no matter what life 
            throws their way. At the heart of our company is a commitment to helping 
            you secure your future, your family, and your business.
          </p>
          <p>
            Our team of dedicated agents is passionate about guiding you through 
            the insurance process, offering expert advice and personalized solutions 
            that make sense for you.
          </p>
          <p>
            <a href="/policies">
              ⇒ Explore Policies!
            </a>
          </p>
          <p>
            We believe in fostering long-term relationships, built on trust, 
            integrity, and the goal of helping you live confidently. Join us on 
            the journey to securing your future with a company that genuinely cares.
          </p>
          <p>
            <a href="/careers">
              ⇒ Join Us!
            </a>              
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;