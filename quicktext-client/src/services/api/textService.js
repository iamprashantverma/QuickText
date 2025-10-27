import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const createText = async (textData) => {
  return await axios.post(`${API_BASE_URL}/texts`, textData);
};


export const getTextById = async (id) => {
  return await axios.get(`${API_BASE_URL}/texts/${id}`);
};


export const getAllTexts = async () => {
  return await axios.get(`${API_BASE_URL}/texts`);
};


export const updateText = async (id, textData) => {
  return await axios.put(`${API_BASE_URL}/texts/${id}`, textData);
};


export const deleteText = async (id) => {
  return await axios.delete(`${API_BASE_URL}/texts/${id}`);
};

export const validateCustomURL = async (customLink) => {
  return await axios.post(`${API_BASE_URL}/texts/validate-link`, { customLink });
};
