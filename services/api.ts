import axios from "axios";
import { cookies } from "next/headers";

const api = axios.create({
  baseURL: process.env.URL,
  headers: {
    "Cache-Control": "public, max-age=3600, stale-while-revalidate=59",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: any) => {
    if (!config.url.includes("login") || !config.url.includes("register")) {
      const storeCookie = cookies();
      const token = storeCookie.get("auth-token");
      if (token?.value) {
        config.headers.Authorization = `Bearer ${token.value}`;
      }
    }

    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default api;
