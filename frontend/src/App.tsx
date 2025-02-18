import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Component Imports
import Header from "./components/Header";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Careers from "./pages/Careers";

// Page Imports
import Policies from "./pages/Policies";
import PolicyDetails from "./pages/PolicyDetails";
import Contact from "./pages/Contact"

const App: React.FC = () => {
  return (
    <Router>
      <Header /> {/* Optional: Consider adding if you had it in your imports */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/policies" element={<Policies />} />
        <Route path="/policy/:slug" element={<PolicyDetails />} />
        <Route path="*" element={<Home />} />{" "}
        <Route path="/Careers" element={<Careers />} />
        {/* Redirects to Home for unknown routes */}
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
