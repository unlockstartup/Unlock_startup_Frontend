import axios from "axios";

const publisherApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://unlock-startup-project-backend.onrender.com",
});

publisherApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("publisher_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default publisherApi;