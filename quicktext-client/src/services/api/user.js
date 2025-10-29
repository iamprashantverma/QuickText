import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const signUp = async (credentials) => {
  return  await axios.post(`${API_BASE_URL}/user/signup`, credentials);  
};

const withAuth = () => {
  const token = localStorage.getItem("token");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append('profileImage', file);
  const headers = { ...withAuth().headers, 'Content-Type': 'multipart/form-data' };
  return await axios.put(`${API_BASE_URL}/user/`, formData, { headers });
};

export const getUser = async () => {
  return await axios.get(`${API_BASE_URL}/user`, withAuth());
};


