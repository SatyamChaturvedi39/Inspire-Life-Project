import React, { useState, FormEvent, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./InsuranceChatbot.css";
import chatbot from "../assets/chatbot.png";

// Define types for our data structure
type ChatMessage = {
  sender: "bot" | "user";
  message: string;
};

type MenuOption = {
  id: string;
  label: string;
};

// Define valid section types for state management
type ActiveSectionType = "policies" | "services" | "location" | null;

const InsuranceChatbot: React.FC = () => {
  const navigate = useNavigate();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      sender: "bot",
      message:
        "Hello! I can help you with insurance policies, contact information, services, finding our office, or career opportunities. What would you like to know about today?",
    },
  ]);
  const [showOptions, setShowOptions] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<ActiveSectionType>(null);
  const [userTyping, setUserTyping] = useState<string>("");

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Main menu options - added "Work with us" option
  const mainOptions: MenuOption[] = [
    { id: "policies", label: "Insurance Policies" },
    { id: "contact", label: "Contact Information" },
    { id: "services", label: "Our Services" },
    { id: "location", label: "Office Locator" },
    { id: "careers", label: "Work with us" },
  ];

  // Updated policy options with proper slugs that match your API
  const policyOptions: MenuOption[] = [
    { id: "lic-insurance", label: "LIC Insurance" },
    { id: "star-health-insurance", label: "Star Health Insurance" },
    { id: "care-health-insurance", label: "Care Health Insurance" },
  ];

  // Services submenu
  const serviceOptions: MenuOption[] = [
    { id: "claims", label: "Claims Assistance" },
    { id: "renewal", label: "Policy Renewal & Review" },
    { id: "consultation", label: "Coverage Consultation" },
  ];

  // Function to handle navigations based on your app structure
  const handleNavigation = (page: string): void => {
    // Map the chatbot options to your application routes
    const routes: { [key: string]: string } = {
      booking: "/slotform",
      "lic-insurance": "/policies",
      "star-health-insurance": "/policies",
      "care-health-insurance": "/policies",
      claims: "/slotform",
      renewal: "/slotform",
      consultation: "/slotform",
      location: "/contact",
      careers: "/careers",
      policies: "/policies",
      contact: "/contact",
    };

    if (routes[page]) {
      setTimeout(() => navigate(routes[page]), 1000);
    }
  };

  const handleOptionClick = (optionId: string): void => {
    let botResponse = "";
    setShowOptions(false);

    // Handle main menu options
    if (optionId === "policies") {
      botResponse = "Which insurance policy are you interested in?";
      setActiveSection("policies");
    } else if (optionId === "contact") {
      botResponse =
        "I'll redirect you to our contact page for more information.";

      // Add user message
      setChatHistory([
        ...chatHistory,
        { sender: "user", message: "Contact Information" },
      ]);

      // Add bot message then navigate after delay
      setTimeout(() => {
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { sender: "bot", message: botResponse },
        ]);

        handleNavigation("contact");
      }, 500);

      return;
    } else if (optionId === "services") {
      botResponse =
        "We offer the following services. Which one would you like to know more about?";
      setActiveSection("services");
    } else if (optionId === "location") {
      botResponse =
        "Let me redirect you to our contact page where you can find our location.";

      // Add user message
      setChatHistory([
        ...chatHistory,
        { sender: "user", message: "Office Locator" },
      ]);

      // Add bot message then navigate after delay
      setTimeout(() => {
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { sender: "bot", message: botResponse },
        ]);

        handleNavigation("location");
      }, 500);

      return;
    } else if (optionId === "careers") {
      botResponse =
        "Great! Let me redirect you to our careers page where you can explore opportunities to work with us.";

      // Add user message
      setChatHistory([
        ...chatHistory,
        { sender: "user", message: "Work with us" },
      ]);

      // Add bot message then navigate after delay
      setTimeout(() => {
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { sender: "bot", message: botResponse },
        ]);

        handleNavigation("careers");
      }, 500);

      return;
    }

    // Handle policy options
    else if (
      [
        "lic-insurance",
        "star-health-insurance",
        "care-health-insurance",
      ].includes(optionId)
    ) {
      const policyName =
        optionId === "lic-insurance"
          ? "LIC Insurance"
          : optionId === "star-health-insurance"
          ? "Star Health Insurance"
          : "Care Health Insurance";

      botResponse = `I'll redirect you to our ${policyName} page where you can find all the details.`;

      // Add user message
      setChatHistory([...chatHistory, { sender: "user", message: policyName }]);

      // Add bot message then navigate after delay
      setTimeout(() => {
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { sender: "bot", message: botResponse },
        ]);

        handleNavigation(optionId);
      }, 500);

      return;
    }

    // Handle service options
    else if (["claims", "renewal", "consultation"].includes(optionId)) {
      const serviceName =
        optionId === "claims"
          ? "Claims Assistance"
          : optionId === "renewal"
          ? "Policy Renewal & Review"
          : "Coverage Consultation";

      botResponse = `I'll redirect you to our booking page where you can schedule ${serviceName}.`;

      // Add user message
      setChatHistory([
        ...chatHistory,
        { sender: "user", message: serviceName },
      ]);

      // Add bot message then navigate after delay
      setTimeout(() => {
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { sender: "bot", message: botResponse },
        ]);

        handleNavigation("booking");
      }, 500);

      return;
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
            {chat.sender === "bot" && (
              <div className="bot-avatar">
                <img src={chatbot} alt="Raksha" className="avatar-image" />
              </div>
            )}
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
      </div>
    </div>
  );
};

export default InsuranceChatbot;
