import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//Context Imports
import { AuthProvider } from "./context/AuthContext";

// Component Imports
import Header from "./components/Header";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import PublicRoute from "./context/PublicRoute";

// Page Imports
import Home from "./pages/Home";
import Careers from "./pages/Careers";
import Policies from "./pages/Policies";
import PolicyDetails from "./pages/PolicyDetails";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";
import Login from "./pages/Login";
import AgentDashboard from "./pages/AgentDashboard";
import ProtectedRoute from "./context/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/policies/:slug" element={<PolicyDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/login" element={
            <PublicRoute>
            <Login />
           </PublicRoute>
          } />

          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 - Not Found Page */}
          <Route
            path="/dashboard/agent"
            element={
              <ProtectedRoute requiredRole="agent">
                <AgentDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Home />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;
