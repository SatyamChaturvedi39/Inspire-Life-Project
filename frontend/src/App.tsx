import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Component Imports
import Header from "./components/Header";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";

// Page Imports
import Policies from "./pages/Policies";

const App: React.FC = () => {
  return (
    <Router>
      <Header /> {/* Optional: Consider adding if you had it in your imports */}
      
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/policies" element={<Policies />} />
        <Route path="*" element={<Home />} /> {/* Redirects to Home for unknown routes */}
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;