import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const createText = async (textData) => {
  return await axios.post(`${API_BASE_URL}/create`, textData);
};


export const getTextByLink = async (link) => {
 
  return await axios.get(`${API_BASE_URL}/${link}`);
};


export const getAllTexts = async () => {
  return await axios.get(`${API_BASE_URL}/`);
};


export const updateText = async (id, textData) => {
  return await axios.put(`${API_BASE_URL}/${id}`, textData);
};


export const deleteText = async (id) => {
  return await axios.delete(`${API_BASE_URL}/${id}`);
};

export const validateCustomURL = async (customLink) => {
  return await axios.post(`${API_BASE_URL}/validate-link`, { customLink });
};
