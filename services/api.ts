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
  console.log(data)
  return data
}

export default Api;
