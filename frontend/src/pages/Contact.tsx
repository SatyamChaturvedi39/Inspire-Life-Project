import React from 'react';
import { useLocation } from 'react-router-dom';
import './Contact.css';

const Contact: React.FC = () => {
  const location = useLocation();

  return (
    <div className="Contact-Division">
      <main className="flex-grow">
        <div className="Contact-Main">
          <h1 className="Contact-text">Contact Us</h1>
          
          <div className="Contact-Container">
            <div>
              <h2 className="Address">Address:</h2>
              <p className="Add-Info">Inspire Life Insurance Solutions</p>
              <p className="Add-Info">Jayanagar, Bengaluru.</p>
            </div>
            
            <div>
              <h2 className="Contact-No">Contact Number:</h2>
              <p className="Contact-Info">+91-9876543210</p>
              <p className="Contact-Info">+91-9976521348</p>
            </div>
            
            <section className='Map'>
              <h2 className="Map3">Location:</h2>
              <div className="w-full h-64 bg-gray-200 mt-2(3)"></div>
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