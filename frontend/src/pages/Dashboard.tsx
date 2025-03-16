import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getEmployeeById } from "../utils/employeeService";
console.log("Dashboard Loaded");
const Dashboard = () => {
  console.log("Dashboard Loaded");
  const { accessToken } = useAuth();
  const [employeeName, setEmployeeName] = useState("Loading...");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (!accessToken) return;

    // Fetch employee details
    getEmployeeById(accessToken, "employee_id") // Replace with actual ID
      .then((response) => {
        setEmployeeName(response.data.data.name);
        setRole(response.data.data.isAdmin ? "admin" : "agent");
      })
      .catch(() => setEmployeeName("User"));
  }, [accessToken]);

  const buttons = [
    { label: "Policy Management", path: "/policies" },
    { label: "Client Consultations", path: "/clients" },
    ...(role === "admin"
      ? [
          { label: "Applicant Appointments", path: "/applicants" },
          { label: "Agent Management", path: "/agents" },
        ]
      : []),
    { label: "Lead Overview", path: "/leads" },
  ];

  return (
    <div className="flex flex-col items-center p-4 md:flex-row md:items-start md:gap-6">
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <h1 className="text-xl font-bold">Welcome, {employeeName}!</h1>
        {buttons.map((btn, index) => (
          <a
            key={index}
            href={btn.path}
            className="p-4 bg-blue-500 text-white rounded-lg shadow-md text-center hover:bg-blue-600 transition"
          >
            {btn.label}
          </a>
        ))}
      </div>
      <div className="w-full md:w-2/3 mt-6 md:mt-0">
        <h2 className="text-lg font-semibold">Upcoming Meetings</h2>
        <div className="p-4 bg-gray-100 rounded-lg shadow-md">
          {/* Meeting List Component Goes Here */}
          <p>No upcoming meetings</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
