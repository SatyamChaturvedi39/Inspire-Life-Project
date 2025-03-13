import React from 'react';
import './Contact.css';
import ContactImage from "../assets/Contact Us.png";

const Contact: React.FC = () => {
  return (
    <div className="Contact-Division">
      <div className="contact-image-container">
        <img src={ContactImage} alt="Insurance Services" className="contact-hero-image" />
      </div>
      <main className="flex-grow">
        <div className="Contact-Main">
          <h1 className="Contact-text">Contact Us</h1>
          
          <div className="Contact-Container">
            <div>
              <h2 className="Address">Address</h2>
              <p className="Add-Info">Inspire Life Insurance Solutions</p>
              <p className="Add-Info">Jayanagar, Bengaluru.</p>
            </div>
            
            <div>
              <h2 className="Contact-No">Contact Number</h2>
              <p className="Contact-Info">+91-9876543210</p>
              <p className="Contact-Info">+91-9976521348</p>
            </div>
            
            <section className='Map'>
              <h2 className="Map3">Location:</h2>
              <div className="Site-map3">
                <div className="map3">
                  <div className="gmap_canvas3">
                    <iframe
                      className="gmap_iframe3"
                      width={200} // Changed to number
                      frameBorder={0} // Changed to number
                      scrolling="no"
                      marginHeight={0} // Changed to number
                      marginWidth={0} // Changed to number
                      src="https://maps.google.com/maps?width=578&amp;height=400&amp;hl=en&amp;q=715, 22nd Cross Rd, K.R.Road, Banashankari Stage II, Banashankari, Bengaluru, Karnataka 560070&amp;t=&amp;z=17&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                    ></iframe>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;