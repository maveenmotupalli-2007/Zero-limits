import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:9000",
});

export const analyzeStrategy = (message) =>
  API.post("/ai/analyze", { message });

export const generateEmail = (message) =>
  API.post("/ai/generate-email", { message });

export const competitorAnalysis = (message) =>
  API.post("/ai/competitor-analysis", { message });