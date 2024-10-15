'use server'

import axios from "axios";

const Api = axios.create({
  baseURL: process.env.URL,
  headers: {
    "Content-Type": "application/json",
  },
});


export default Api;
