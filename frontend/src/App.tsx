import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Component Imports
import Header from "./components/Header";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";

// Page Imports
import Home from "./pages/Home";
import Careers from "./pages/Careers";
import Policies from "./pages/Policies";
import PolicyDetails from "./pages/PolicyDetails";
import Contact from "./pages/Contact";
import SlotForm from "./pages/SlotForm";
import AboutUs from "./pages/AboutUs";
import Login from "./pages/Login";

const App: React.FC = () => {
  return (
    <Router>
      <Header /> {/* Optional: Consider adding if you had it in your imports */}
      <Navbar />
      <Routes>
        {/* Correct Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/careers" element={<Careers />} />{" "}
        {/* Fixed '/Careers' to '/careers' */}
        <Route path="/policies" element={<Policies />} />
        <Route path="/policy/:slug" element={<PolicyDetails />} />
        <Route path="*" element={<Home />} />{" "}
        <Route path="/Careers" element={<Careers />} />
        {/* Redirects to Home for unknown routes */}
        <Route path="/contact" element={<Contact />} />
        {/* SlotForm route (Make sure it's '/slotform' as per your link) */}
        <Route path="/slotform" element={<SlotForm />} /> {/* Corrected path */}
        {/* Wildcard Route: Redirect to Home for unknown routes */}
        <Route path="*" element={<Home />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
