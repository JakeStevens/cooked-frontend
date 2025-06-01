// API service to handle backend communication
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

class ApiService {
  async get(endpoint) {
    try {
      console.log(`Making GET request to: ${API_BASE_URL}${endpoint}`);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Construct a more informative error message
        const errorBody = await response.text(); // Try to get error body
        throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}, body: ${errorBody}`);
      }

      const data = await response.json();
      console.log('API GET Response:', data);
      return data;
    } catch (error) {
      console.error('API GET error:', error);
      throw error;
    }
  }

  async post(endpoint, data) {
    try {
      console.log(`Making POST request (JSON) to: ${API_BASE_URL}${endpoint}`);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}, body: ${errorBody}`);
      }

      const result = await response.json();
      console.log('API POST (JSON) Response:', result);
      return result;
    } catch (error) {
      console.error('API POST (JSON) error:', error);
      throw error;
    }
  }

  async uploadImage(endpoint, file) {
    try {
      console.log(`Making POST request (file upload) to: ${API_BASE_URL}${endpoint}`);
      const formData = new FormData();
      formData.append('image', file); // 'image' is a common field name for the file

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        // NOTE: Do NOT set 'Content-Type' manually for FormData.
        // The browser will automatically set it to 'multipart/form-data'
        // with the correct boundary.
        body: formData,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}, body: ${errorBody}`);
      }

      const result = await response.json(); // Assuming the backend responds with JSON
      console.log('API File Upload Response:', result);
      return result;
    } catch (error) {
      console.error('API File Upload error:', error);
      throw error;
    }
  }
}

export default new ApiService();
