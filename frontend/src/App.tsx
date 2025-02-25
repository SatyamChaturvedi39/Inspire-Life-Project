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
import AdminDashboard from "./pages/AgentDashboard";
import ManageSlots from "./pages/ManageSlots";

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/policies" element={<Policies />} />
        <Route path="/policy/:slug" element={<PolicyDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/slotform" element={<SlotForm />} />
        <Route path="/about-us" element={<AboutUs />} />{" "}
        {/* Unified to lowercase */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/manage-slots" element={<ManageSlots />} />
         {/* Redirect unknown routes to Home */}
        <Route path="*" element={<Home />} />{" "}
       
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
