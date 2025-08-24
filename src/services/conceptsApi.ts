// api.ts
import axios from "axios";
import { Concept } from "../types/concepts/types";

const API_URL = "http://10.42.0.243:4000/api";

export async function fetchConcepts(page = 1, limit = 10): Promise<Concept[]> {
  try {
    const res = await axios.get(`${API_URL}/concepts`, { params: { page, limit } });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// RETURNS A DICTIONARY
export async function fetchConceptById(id: number): Promise<Concept> {
  try {
    const res = await axios.get(`${API_URL}/concepts/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}


export async function searchConcepts(query: string, page = 1, limit = 10): Promise<Concept[]> {
  try {
    const res = await axios.get(`${API_URL}/concepts/filter/${query}`, { params: { page, limit } });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createConcept(science: string, token: string): Promise<Concept> {
  try {
    const res = await axios.post(`${API_URL}/concepts`, { science, token });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateConcept(id: number, science: string, token: string): Promise<Concept> {
  try {
    const res = await axios.put(`${API_URL}/concepts/${id}`, { science, token });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteConcept(id: number): Promise<void> {
  try {
    await axios.delete(`${API_URL}/concepts/${id}`);
  } catch (error) {
    console.log(error);
  }
  
}
