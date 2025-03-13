import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useRef,
  useEffect,
} from "react";
import "./InsuranceChatbot.css";

// Define types for our data structure
type ChatMessage = {
  sender: "bot" | "user";
  message: string;
};

type FormDataType = {
  name: string;
  email: string;
  phone: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
};

type MenuOption = {
  id: string;
  label: string;
};

// Define valid section types for state management
type ActiveSectionType =
  | "policies"
  | "services"
  | "location"
  | "lic-page"
  | "star-page"
  | "care-page"
  | "booking-form"
  | null;

const InsuranceChatbot: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      sender: "bot",
      message:
        "Hello! I can help you with insurance policies, contact information, services, or finding our office. What would you like to know about today?",
    },
  ]);
  const [showOptions, setShowOptions] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<ActiveSectionType>(null);
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    phone: "",
    service: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });
  const [userTyping, setUserTyping] = useState<string>("");

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Main menu options
  const mainOptions: MenuOption[] = [
    { id: "policies", label: "Insurance Policies" },
    { id: "contact", label: "Contact Information" },
    { id: "services", label: "Our Services" },
    { id: "location", label: "Office Locator" },
  ];

  // Policies submenu
  const policyOptions: MenuOption[] = [
    { id: "lic", label: "LIC Insurance" },
    { id: "star", label: "Star Health Insurance" },
    { id: "care", label: "Care Health Insurance" },
  ];

  // Services submenu
  const serviceOptions: MenuOption[] = [
    { id: "claims", label: "Claims Assistance" },
    { id: "renewal", label: "Policy Renewal & Review" },
    { id: "consultation", label: "Coverage Consultation" },
  ];

  const handleOptionClick = (optionId: string): void => {
    let botResponse = "";
    setShowOptions(false);

    // Handle main menu options
    if (optionId === "policies") {
      botResponse = "Which insurance policy are you interested in?";
      setActiveSection("policies");
    } else if (optionId === "contact") {
      botResponse =
        "You can reach us at: 1-800-123-4567 or email at contact@insuranceagency.com";
      setActiveSection(null);
      setShowOptions(true);
    } else if (optionId === "services") {
      botResponse =
        "We offer the following services. Which one would you like to know more about?";
      setActiveSection("services");
    } else if (optionId === "location") {
      botResponse = "Here's our office location:";
      setActiveSection("location");
    }

    // Handle policy options
    else if (optionId === "lic") {
      botResponse =
        "LIC Insurance offers comprehensive life insurance coverage. Would you like to visit the LIC policy page?";
      setActiveSection("lic-page");
    } else if (optionId === "star") {
      botResponse =
        "Star Health Insurance provides excellent health coverage options. Would you like to visit the Star Health policy page?";
      setActiveSection("star-page");
    } else if (optionId === "care") {
      botResponse =
        "Care Health Insurance specializes in affordable health plans. Would you like to visit the Care Health policy page?";
      setActiveSection("care-page");
    }

    // Handle service options
    else if (optionId === "claims") {
      botResponse =
        "For Claims Assistance, please book a slot with our expert:";
      setActiveSection("booking-form");
      setFormData({ ...formData, service: "Claims Assistance" });
    } else if (optionId === "renewal") {
      botResponse =
        "For Policy Renewal & Review, please book a slot with our expert:";
      setActiveSection("booking-form");
      setFormData({ ...formData, service: "Policy Renewal & Review" });
    } else if (optionId === "consultation") {
      botResponse =
        "For Coverage Consultation, please book a slot with our expert:";
      setActiveSection("booking-form");
      setFormData({ ...formData, service: "Coverage Consultation" });
    }

    // Find the label for the selected option
    const allOptions = [...mainOptions, ...policyOptions, ...serviceOptions];
    const selectedOption = allOptions.find((option) => option.id === optionId);
    const optionLabel = selectedOption ? selectedOption.label : optionId;

    // Add user message
    setChatHistory([...chatHistory, { sender: "user", message: optionLabel }]);

    // Simulate typing delay for bot response
    setTimeout(() => {
      if (botResponse) {
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { sender: "bot", message: botResponse },
        ]);
      }
    }, 500);
  };

  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    // Add user message confirming form submission
    setChatHistory([
      ...chatHistory,
      {
        sender: "user",
        message: `Booking an appointment for ${formData.service}`,
      },
    ]);

    // Simulate typing delay for bot response
    setTimeout(() => {
      setChatHistory((prevHistory) => [
        ...prevHistory,
        {
          sender: "bot",
          message: `Thank you ${formData.name}! Your appointment for ${formData.service} has been scheduled for ${formData.preferredDate} at ${formData.preferredTime}. We'll contact you soon to confirm.`,
        },
      ]);
      setActiveSection(null);
      setShowOptions(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        preferredDate: "",
        preferredTime: "",
        message: "",
      });
    }, 800);
  };

  const handleBackToMain = (): void => {
    // Add user message
    setChatHistory([
      ...chatHistory,
      { sender: "user", message: "Back to main menu" },
    ]);

    // Simulate typing delay for bot response
    setTimeout(() => {
      setChatHistory((prevHistory) => [
        ...prevHistory,
        {
          sender: "bot",
          message: "What else would you like to know about today?",
        },
      ]);
      setActiveSection(null);
      setShowOptions(true);
    }, 500);
  };

  const handleCustomUserInput = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!userTyping.trim()) return;

    // Add user message
    setChatHistory([...chatHistory, { sender: "user", message: userTyping }]);
    setUserTyping("");

    // Simulate typing delay for bot response
    setTimeout(() => {
      setChatHistory((prevHistory) => [
        ...prevHistory,
        {
          sender: "bot",
          message:
            "I'm designed to help with specific insurance-related queries. Please select one of the options below:",
        },
      ]);
      setActiveSection(null);
      setShowOptions(true);
    }, 800);
  };

  return (
    <div className="insurance-chatbot">
      <div className="chat-history" ref={chatContainerRef}>
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`chat-message ${
              chat.sender === "bot" ? "bot-message" : "user-message"
            }`}
          >
            {chat.sender === "bot" && <div className="bot-avatar">R</div>}
            <div className="message-bubble">{chat.message}</div>
          </div>
        ))}
      </div>

      {/* User input area */}
      <form onSubmit={handleCustomUserInput} className="user-input-form">
        <input
          type="text"
          value={userTyping}
          onChange={(e) => setUserTyping(e.target.value)}
          placeholder="Type your message..."
          className="user-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>

      <div className="chat-options">
        {showOptions && (
          <div className="option-container">
            <div className="option-label">Quick Options:</div>
            <div className="main-options">
              {mainOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option.id)}
                  className="option-button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeSection === "policies" && (
          <div className="option-container">
            <div className="option-label">Insurance Policies:</div>
            <div className="sub-options">
              {policyOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option.id)}
                  className="option-button"
                >
                  {option.label}
                </button>
              ))}
              <button onClick={handleBackToMain} className="back-button">
                Back to Main Menu
              </button>
            </div>
          </div>
        )}

        {activeSection === "services" && (
          <div className="option-container">
            <div className="option-label">Our Services:</div>
            <div className="sub-options">
              {serviceOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option.id)}
                  className="option-button"
                >
                  {option.label}
                </button>
              ))}
              <button onClick={handleBackToMain} className="back-button">
                Back to Main Menu
              </button>
            </div>
          </div>
        )}

        {activeSection === "location" && (
          <div className="map-container">
            <div className="placeholder-map">
              <img src="/api/placeholder/600/300" alt="Office Location Map" />
              <p>123 Insurance Street, Business District, City, 12345</p>
            </div>
            <button onClick={handleBackToMain} className="back-button">
              Back to Main Menu
            </button>
          </div>
        )}

        {(activeSection === "lic-page" ||
          activeSection === "star-page" ||
          activeSection === "care-page") && (
          <div className="policy-page-buttons">
            <button className="visit-page-button">
              Visit{" "}
              {activeSection === "lic-page"
                ? "LIC"
                : activeSection === "star-page"
                ? "Star Health"
                : "Care Health"}{" "}
              Page
            </button>
            <button onClick={handleBackToMain} className="back-button">
              Back to Main Menu
            </button>
          </div>
        )}

        {activeSection === "booking-form" && (
          <div className="booking-form-container">
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Service</label>
                <input
                  type="text"
                  name="service"
                  value={formData.service}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Preferred Date</label>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Preferred Time</label>
                <input
                  type="time"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Message (Optional)</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-button">
                  Book Appointment
                </button>
                <button
                  type="button"
                  onClick={handleBackToMain}
                  className="back-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsuranceChatbot;
