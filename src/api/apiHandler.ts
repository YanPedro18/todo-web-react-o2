import axios from "axios";

const api = axios.create({
  baseURL: "https://fullstack-todo-backend-node-supabase.onrender.com/", // backend
  headers: {
    "Content-Type": "application/json",
  },
});

// interceptor de resposta trata erros globais.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
