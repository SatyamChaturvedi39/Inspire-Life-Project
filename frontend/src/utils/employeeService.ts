import axios from "axios";

const API_URL = "http://localhost:5001/api/employees";

// Function to get all employees (Admin only)
export const getAllEmployees = async (token: string) => {
  return axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Function to get a single employee by ID
export const getEmployeeById = async (token: string, employeeId: string) => {
  return axios.get(`${API_URL}/${employeeId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Function to register a new employee (Admin only)
export const registerEmployee = async (
  token: string,
  name: string,
  email: string,
  password: string,
  isAdmin: boolean
) => {
  return axios.post(
    `${API_URL}/register`,
    { name, email, password, isAdmin },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// Function to update an employee (Admin only)
export const updateEmployee = async (
  token: string,
  employeeId: string,
  updateData: object
) => {
  return axios.put(`${API_URL}/${employeeId}`, updateData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Function to delete an employee (Admin only)
export const deleteEmployee = async (token: string, employeeId: string) => {
  return axios.delete(`${API_URL}/${employeeId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Function to get all agents (Admin only)
export const getAllAgents = async (token: string) => {
  return axios.get(`${API_URL}/agents`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Function to get all admins (Admin only)
export const getAllAdmins = async (token: string) => {
  return axios.get(`${API_URL}/admins`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
