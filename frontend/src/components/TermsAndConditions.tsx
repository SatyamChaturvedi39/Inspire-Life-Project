import React, {useEffect} from "react";
import "./TermsAndConditions.css";

interface TermsAndConditionsPopupProps {
  onAccept: () => void;
  onDecline: () => void;
}

const TermsAndConditionsPopup: React.FC<TermsAndConditionsPopupProps> = ({ onAccept, onDecline }) => {

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
          document.body.style.overflow = "auto";
        };
      }, []);
      


    return (
    <div className="terms-popup-overlay">
      <div className="terms-popup-container">
        <h2>Terms and Conditions</h2>
        <div className="terms-popup-content">
          <p>
            Welcome to Inspire Life Insurance Services. By accessing and using our website and services, you agree to the following terms and conditions.
          </p>
          <p>
            <strong>1. Overview:</strong> Our platform provides comprehensive insurance policy information, appointment scheduling, and agent-client interactions. The information provided is intended for general informational purposes only.
          </p>
          <p>
            <strong>2. Policy Information:</strong> While we strive for accuracy, the details provided on our website are subject to change. Users are encouraged to consult with our agents for the most up-to-date policy information.
          </p>
          <p>
            <strong>3. Appointments and Meetings:</strong> Scheduling features are provided for your convenience. All appointments are subject to confirmation by our agents.
          </p>
          <p>
            <strong>4. User Responsibilities:</strong> Users agree to provide accurate information and use our services responsibly.
          </p>
          <p>
            <strong>5. Limitation of Liability:</strong> Inspire Life Insurance Services is not liable for any errors or omissions in policy details or for any direct or indirect damages arising from the use of our services.
          </p>
          <p>
            <strong>6. Modifications:</strong> We reserve the right to update these terms at any time. Continued use of our platform after any changes signifies your acceptance of the new terms.
          </p>
          <p>
            By clicking "Accept," you confirm that you have read, understood, and agree to these terms and conditions. If you do not agree, click the "Decline" button.
          </p>
        </div>
        <div className="terms-popup-actions">
          <button className="terms-popup-accept" onClick={onAccept}>Accept</button>
          <button className="terms-popup-decline" onClick={onDecline}>Decline</button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPopup;