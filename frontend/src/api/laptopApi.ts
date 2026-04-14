import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export interface LaptopInput {
  Company: string;
  Product: string;
  TypeName: string;
  Ram: number;
  OpSys: string;
  Weight: number;
  Touchscreen: number; // 0 or 1
  IPS: number; // 0 or 1
  PPI: number;
  Cpu_Brand: string;
  Gpu_Brand: string;
  SSD: number;
  HDD: number;
}

export interface PredictionResult {
  predicted_price: number;
}

export const predictPrice = async (data: LaptopInput): Promise<PredictionResult> => {
  try {
    const response = await api.post<PredictionResult>('/predict', data);
    return response.data;
  } catch (error) {
    console.error('Prediction failed:', error);
    throw error;
  }
};

export interface LaptopMetadata {
  companies: string[];
  types: string[];
  opsys: string[];
  cpu_brands: string[];
  gpu_brands: string[];
}

export const fetchMetadata = async (): Promise<LaptopMetadata> => {
  try {
    const response = await api.get<LaptopMetadata>('/metadata');
    return response.data;
  } catch (error) {
    console.error('Fetching metadata failed:', error);
    throw error;
  }
};
