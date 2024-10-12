'use server'

import axios from "axios";

// let token = '';

const Api = axios.create({
  baseURL: process.env.URL,
  headers: {
    "Cache-Control": "public, max-age=3600, stale-while-revalidate=59",
    "Content-Type": "application/json",
  },
});

Api.interceptors.request.use(
  (config: any) => {
    if (!config.url.includes("login") || !config.url.includes("register")) {            
      console.log("request token: ", config.cookie          )
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjIsImlhdCI6MTcyODc1MTU1NywiZXhwIjoxNzI4ODM3OTU3fQ.r7IR068sdOmm2iw1mgl0LPYF4ICQj5a0opGTUrg-aI0";
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export async function aboutMe(context: any) {
  const { req } = context;
  const cookies = req.headers.cookie || '';
  const match = cookies.match(/authToken=([^;]+)/);
  const token = match ? match[1] : null;
  if (!token) {
    return { data: null }
  }
  const data = await Api.get(`${process.env.URL}/platform/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data
}

export default Api;
