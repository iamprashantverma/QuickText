import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const loginService = async (credentials) => {
  return  await axios.post(`${API_BASE_URL}/auth/login`, credentials);  
};


