import axios from 'axios';
import { FurnitureSpecs, GeneratedDocuments } from './types';

const API_BASE_URL = '/api';

export const api = {
  // Generate initial design
  generateDesign: async (description: string, imageFile?: File) => {
    const formData = new FormData();
    formData.append('description', description);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await axios.post(`${API_BASE_URL}/design/generate`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Modify existing design
  modifyDesign: async (sessionId: string, userMessage: string) => {
    const response = await axios.post(`${API_BASE_URL}/design/modify/${sessionId}`, {
      userMessage
    });
    return response.data;
  },

  // Chat without modifying design
  chat: async (sessionId: string, userMessage: string) => {
    const response = await axios.post(`${API_BASE_URL}/design/chat/${sessionId}`, {
      userMessage
    });
    return response.data;
  },

  // Lock design
  lockDesign: async (sessionId: string) => {
    const response = await axios.post(`${API_BASE_URL}/design/lock/${sessionId}`);
    return response.data;
  },

  // Get design state
  getDesign: async (sessionId: string) => {
    const response = await axios.get(`${API_BASE_URL}/design/${sessionId}`);
    return response.data;
  },

  // Generate documents
  generateDocuments: async (sessionId: string, specs: FurnitureSpecs) => {
    const response = await axios.post(`${API_BASE_URL}/document/generate/${sessionId}`, {
      specs
    });
    return response.data;
  },

  // Get documents
  getDocuments: async (sessionId: string) => {
    const response = await axios.get(`${API_BASE_URL}/document/${sessionId}`);
    return response.data;
  },

  // Export as ZIP
  exportZip: (sessionId: string) => {
    return `${API_BASE_URL}/document/export/${sessionId}/zip`;
  },

  // Export as PDF
  exportPdf: (sessionId: string, docType: string) => {
    return `${API_BASE_URL}/document/export/${sessionId}/pdf/${docType}`;
  }
};
