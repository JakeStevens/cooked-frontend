import React, { useState, useEffect } from 'react';
import ApiService from './services/api';
import './App.css';

function App() {
  // State management
  const [backendMessage, setBackendMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend when component mounts
  useEffect(() => {
    fetchHomepageData();
  }, []);

  const fetchHomepageData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Call the root endpoint of your FastAPI backend
      const response = await ApiService.get('/');
      
      setBackendMessage(response.message || 'No message from backend');
      setConnectionStatus('✅ Connected to FastAPI');
    } catch (error) {
      console.error('Failed to connect to backend:', error);
      setConnectionStatus('❌ Failed to connect to backend');
      setError('Make sure your FastAPI server is running on http://127.0.0.1:8000');
    } finally {
      setLoading(false);
    }
  };

  const testApiEndpoint = async () => {
    try {
      const response = await ApiService.get('/api/health');
      alert(`Health check: ${response.status}`);
    } catch (error) {
      alert('Health check failed');
    }
  };

  const refreshData = () => {
    fetchHomepageData();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React + FastAPI Integration</h1>
        
        {/* Connection Status */}
        <div className="status-section">
          <h2>Backend Connection</h2>
          <p className={connectionStatus.includes('✅') ? 'success' : 'error'}>
            {connectionStatus}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading">
            <p>Loading data from backend...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error">
            <h3>Connection Error</h3>
            <p>{error}</p>
            <button onClick={refreshData} className="retry-button">
              Retry Connection
            </button>
          </div>
        )}

        {/* Success State - Display Backend Message */}
        {!loading && !error && backendMessage && (
          <div className="content">
            <h2>Message from FastAPI Backend:</h2>
            <div className="message-box">
              <p>"{backendMessage}"</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="actions">
          <button onClick={refreshData} className="action-button">
            Refresh Data
          </button>
          <button onClick={testApiEndpoint} className="action-button">
            Test Health Endpoint
          </button>
        </div>

        {/* Development Info */}
        <div className="dev-info">
          <h3>Development Info</h3>
          <p><strong>Frontend:</strong> http://localhost:3000</p>
          <p><strong>Backend:</strong> http://127.0.0.1:8000</p>
          <p><strong>API Docs:</strong> <a href="http://127.0.0.1:8000/docs" target="_blank" rel="noopener noreferrer">http://127.0.0.1:8000/docs</a></p>
        </div>
      </header>
    </div>
  );
}

export default App;