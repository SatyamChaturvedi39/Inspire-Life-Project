import React, { useState, FormEvent, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./InsuranceChatbot.css";
import chatbot from "../assets/chatbot.png";

// Defining the types for our data structure
type ChatMessage = {
  sender: "bot" | "user";
  message: string;
};

type MenuOption = {
  id: string;
  label: string;
  keywords: string[]; // Keywords that will trigger this option
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

  // Main menu options with keywords for natural language matching
  const mainOptions: MenuOption[] = [
    {
      id: "policies",
      label: "Insurance Policies",
      keywords: [
        "policy",
        "policies",
        "insurance",
        "plan",
        "coverage",
        "insure",
        "protection",
        "health",
        "finance",
        "life",
        "house",
        "housing",
      ],
    },
    {
      id: "contact",
      label: "Contact Information",
      keywords: [
        "contact",
        "phone",
        "email",
        "call",
        "reach",
        "message",
        "number",
        "details",
      ],
    },
    {
      id: "services",
      label: "Our Services",
      keywords: [
        "service",
        "services",
        "offering",
        "provide",
        "assistance",
        "help",
        "support",
      ],
    },
    {
      id: "location",
      label: "Office Locator",
      keywords: [
        "location",
        "office",
        "address",
        "where",
        "find",
        "visit",
        "place",
        "branch",
        "directions",
        "map",
      ],
    },
    {
      id: "careers",
      label: "Work with us",
      keywords: [
        "career",
        "job",
        "work",
        "employment",
        "hire",
        "position",
        "opportunity",
        "vacancy",
        "joining",
        "apply",
      ],
    },
  ];

  // Policy options with keywords
  const policyOptions: MenuOption[] = [
    {
      id: "lic-insurance",
      label: "LIC Insurance",
      keywords: ["lic", "life insurance", "life insurance corporation"],
    },
    {
      id: "star-health-insurance",
      label: "Star Health Insurance",
      keywords: ["star", "star health", "health insurance", "medical"],
    },
    {
      id: "care-health-insurance",
      label: "Care Health Insurance",
      keywords: [
        "care",
        "care health",
        "medical coverage",
        "health plan",
        "healthcare",
      ],
    },
  ];

  // Services with keywords
  const serviceOptions: MenuOption[] = [
    {
      id: "claims",
      label: "Claims Assistance",
      keywords: [
        "claim",
        "claims",
        "file claim",
        "claim process",
        "claim assistance",
        "claim help",
      ],
    },
    {
      id: "renewal",
      label: "Policy Renewal & Review",
      keywords: [
        "renewal",
        "renew",
        "review",
        "extend",
        "policy review",
        "update policy",
      ],
    },
    {
      id: "consultation",
      label: "Coverage Consultation",
      keywords: [
        "consultation",
        "consult",
        "advice",
        "coverage consultation",
        "guidance",
        "recommendation",
      ],
    },
  ];

  // Get all options for matching against user input
  const getAllOptions = (): MenuOption[] => {
    return [...mainOptions, ...policyOptions, ...serviceOptions];
  };

  // Function to find the best match for user input from available options
  const findBestMatch = (
    userInput: string,
    availableOptions: MenuOption[]
  ): string | null => {
    const input = userInput.toLowerCase();
    let bestMatchId: string | null = null;
    let highestScore = 0;

    availableOptions.forEach((option) => {
      // Check if the input contains the option label
      if (input.includes(option.label.toLowerCase())) {
        return option.id; // Direct match with label
      }

      // Check for keyword matches
      for (const keyword of option.keywords) {
        if (input.includes(keyword.toLowerCase())) {
          // Simple scoring - can be improved with more sophisticated NLP later
          const score = keyword.length / input.length; // Longer keyword matches are more significant
          if (score > highestScore) {
            highestScore = score;
            bestMatchId = option.id;
          }
        }
      }
    });

    // Only return a match if the score is significant enough
    return highestScore > 0.1 ? bestMatchId : null;
  };

  // Updated navigation function to allow optional query parameters
  const handleNavigation = (page: string, queryParam: string = ""): void => {
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
      setTimeout(() => navigate(routes[page] + queryParam), 3000);
    }
  };

  const handleOptionClick = (optionId: string): void => {
    let botResponse = "";
    setShowOptions(false);

    // Handle main menu options
    if (optionId === "policies") {
      botResponse =
        "Which insurance policy are you interested in? Please select one from the quick options above.";
      setActiveSection("policies");
    } else if (optionId === "contact") {
      botResponse =
        "I'll redirect you to our contact page for more information.";

      setChatHistory([
        ...chatHistory,
        { sender: "user", message: "Contact Information" },
      ]);

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
        "We offer the above services. Which one would you like to know more about?";
      setActiveSection("services");
    } else if (optionId === "location") {
      botResponse =
        "Let me redirect you to our contact page where you can find our location.";

      setChatHistory([
        ...chatHistory,
        { sender: "user", message: "Office Locator" },
      ]);

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

      setChatHistory([
        ...chatHistory,
        { sender: "user", message: "Work with us" },
      ]);

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

      // Set the search keyword based on the selected policy (e.g., LIC, Star, or Care)
      const searchKeyword =
        optionId === "lic-insurance"
          ? "LIC"
          : optionId === "star-health-insurance"
          ? "Star"
          : "Care";

      botResponse = `I'll redirect you to our ${policyName} policies page.`;
      setChatHistory([...chatHistory, { sender: "user", message: policyName }]);
      setTimeout(() => {
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { sender: "bot", message: botResponse },
        ]);
        handleNavigation(optionId, `?search=${searchKeyword}`);
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

      botResponse = `I'll redirect you to our policies page. Please click on the "Book a Slot" image to schedule ${serviceName}.`;
      setChatHistory([
        ...chatHistory,
        { sender: "user", message: serviceName },
      ]);
      setTimeout(() => {
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { sender: "bot", message: botResponse },
        ]);
        handleNavigation("policies");
      }, 500);
      return;
    }

    // Find the label for the selected option
    const allOptions = getAllOptions();
    const selectedOption = allOptions.find((option) => option.id === optionId);
    const optionLabel = selectedOption ? selectedOption.label : optionId;

    // Add user message
    setChatHistory([...chatHistory, { sender: "user", message: optionLabel }]);

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
    setChatHistory([
      ...chatHistory,
      { sender: "user", message: "Back to main menu" },
    ]);

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

    setChatHistory([...chatHistory, { sender: "user", message: userTyping }]);
    const userInput = userTyping;
    setUserTyping("");

    let matchedOptionId: string | null = null;

    if (activeSection === "policies") {
      matchedOptionId = findBestMatch(userInput, policyOptions);
    } else if (activeSection === "services") {
      matchedOptionId = findBestMatch(userInput, serviceOptions);
    } else {
      matchedOptionId = findBestMatch(userInput, mainOptions);
      if (!matchedOptionId) {
        const policyMatch = findBestMatch(userInput, policyOptions);
        if (policyMatch) {
          matchedOptionId = policyMatch;
        } else {
          const serviceMatch = findBestMatch(userInput, serviceOptions);
          if (serviceMatch) {
            matchedOptionId = serviceMatch;
          }
        }
      }
    }

    if (matchedOptionId) {
      setTimeout(() => {
        handleOptionClick(matchedOptionId as string);
      }, 800);
    } else {
      setTimeout(() => {
        setChatHistory((prevHistory) => [
          ...prevHistory,
          {
            sender: "bot",
            message:
              "I'm not sure I understand. Could you please select one of these options or try rephrasing your question?",
          },
        ]);
        setShowOptions(true);
      }, 800);
    }
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
