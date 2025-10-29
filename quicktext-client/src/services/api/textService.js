import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const withAuth = () => {
  const token = localStorage.getItem("token");
  return token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
};

export const createText = async (textData) => {
  return await axios.post(`${API_BASE_URL}/create`, textData, withAuth());
};


export const getTextByLink = async (link) => {
  return await axios.get(`${API_BASE_URL}/${link}`, withAuth());
};


export const getAllTexts = async () => {
  return await axios.get(`${API_BASE_URL}/texts`, withAuth());
};



export const deleteText = async (id) => {
  return await axios.delete(`${API_BASE_URL}/${id}`, withAuth());
};


export const validateCustomURL = async (customLink) => {
  return await axios.post(`${API_BASE_URL}/validate-link`, { customLink }, withAuth());
};
