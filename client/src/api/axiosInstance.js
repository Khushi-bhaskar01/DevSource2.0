import axios from "axios";
import { auth } from "../firebase/config";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
