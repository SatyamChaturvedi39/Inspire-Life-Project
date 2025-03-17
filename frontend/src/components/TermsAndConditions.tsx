import React, { useEffect, useState } from "react";
import "./TermsAndConditions.css";

interface TermsAndConditionsPopupProps {
  onAccept: () => void;
  onDecline: () => void;
}

const TermsAndConditionsPopup: React.FC<TermsAndConditionsPopupProps> = ({ onAccept, onDecline }) => {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  useEffect(() => {
    // Save original overflow values
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    // Disable scrolling on both body and html
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, []);

  return (
    <>
      <div className="terms-popup-overlay">
        <div className="terms-popup-container">
          <h2>Terms and Conditions</h2>
          <div className="terms-popup-content">
            <p>
              Welcome to Inspire Life Insurance Services. By accessing and using our website and services, you agree to the following terms and conditions.
            </p> <br />
            <p>
              <strong>Overview:</strong> Our platform provides comprehensive insurance policy information, appointment scheduling, and agent-client interactions. The information provided is intended for general informational purposes only.
            </p>
            <p>
              <strong>Policy Information:</strong> While we strive for accuracy, the details provided on our website are subject to change. Users are encouraged to consult with our agents for the most up-to-date policy information. For more information, please contact us personally and view our{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPrivacyPolicy(true);
                }}
              >
                Privacy Policy
              </a>.
            </p>
            <p>
              <strong>Appointments and Meetings:</strong> Scheduling features are provided for your convenience. All appointments are subject to confirmation by our agents.
            </p>
            <p>
              <strong>User Responsibilities:</strong> Users agree to provide accurate information and use our services responsibly.
            </p>
            <p>
              <strong>Limitation of Liability:</strong> Inspire Life Insurance Services is not liable for any errors or omissions in policy details or for any direct or indirect damages arising from the use of our services.
            </p>
            <p>
              <strong>Modifications:</strong> We reserve the right to update these terms at any time. Continued use of our platform after any changes signifies your acceptance of the new terms.
            </p>
            <p>
              By clicking "Accept," you confirm that you have read, understood, and agree to these terms and conditions. If you do not agree, click the "Decline" button.
            </p>
          </div>
          <div className="terms-popup-actions">
            <button className="terms-popup-accept" onClick={onAccept}>
              Accept
            </button>
            <button className="terms-popup-decline" onClick={onDecline}>
              Decline
            </button>
          </div>
        </div>
      </div>
      {showPrivacyPolicy && <PrivacyPolicyPopup onClose={() => setShowPrivacyPolicy(false)} />}
    </>
  );
};

const PrivacyPolicyPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, []);
  return (
    <div className="terms-popup-overlay">
      <div className="terms-popup-container">
        <h2>Privacy Policy</h2>
        <div className="terms-popup-content">
          <p>
            At Inspire Life Insurance Services, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you access our website and services.
          </p><br />
          <p>
            <strong>Information We Collect:</strong> We may collect personal data such as your name, email address, phone number, and any additional details you provide when scheduling appointments or contacting us.
          </p>
          <p>
            <strong>How We Use Your Information:</strong> Your data is used to provide you with our services, improve our website, and communicate with you. We may use your information for administrative purposes and to send you updates about our offerings.
          </p>
          <p>
            <strong>Data Security:</strong> We implement robust security measures to protect your personal information. While we take reasonable steps to secure your data, no method of transmission over the internet is 100% secure.
          </p>
          <p>
            <strong>Third-Party Disclosure:</strong> We do not sell or share your personal data with third parties except as required by law or necessary to deliver our services.
          </p>
          <p>
            <strong>Updates to This Privacy Policy:</strong> We may update our Privacy Policy from time to time. Any changes will be posted on our website with an updated effective date. Your continued use of our services after such changes indicates your acceptance of the updated policy.
          </p>
          <p>
            If you have any questions or concerns about our privacy practices, please contact our support team for more information.
          </p>
        </div>
        <div className="terms-popup-actions">
          <button className="terms-popup-accept" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPopup;
