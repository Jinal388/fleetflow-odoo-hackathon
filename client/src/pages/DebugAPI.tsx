import React, { useEffect, useState } from 'react';
import api from '../lib/api';

const DebugAPI: React.FC = () => {
  const [apiUrl, setApiUrl] = useState('');
  const [healthStatus, setHealthStatus] = useState('');
  const [loginStatus, setLoginStatus] = useState('');
  const [vehiclesStatus, setVehiclesStatus] = useState('');

  useEffect(() => {
    // Get the API base URL
    const baseURL = (api.defaults.baseURL as string) || 'Not set';
    setApiUrl(baseURL);

    // Test health endpoint
    fetch('http://localhost:5000/health')
      .then(res => res.json())
      .then(data => setHealthStatus(JSON.stringify(data)))
      .catch(err => setHealthStatus(`Error: ${err.message}`));

    // Test login
    api.post('/auth/login', {
      email: 'admin@fleetflow.com',
      password: 'Admin@123'
    })
      .then(res => {
        setLoginStatus(`Success: ${JSON.stringify(res.data)}`);
        
        // Test vehicles
        return api.get('/vehicles');
      })
      .then(res => {
        setVehiclesStatus(`Success: ${JSON.stringify(res.data)}`);
      })
      .catch(err => {
        setLoginStatus(`Error: ${err.message} - ${err.response?.data?.message || ''}`);
      });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>API Debug Page</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Environment Variables:</h2>
        <p><strong>VITE_API_URL:</strong> {import.meta.env.VITE_API_URL || 'Not set'}</p>
        <p><strong>API Base URL (axios):</strong> {apiUrl}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Health Check:</h2>
        <pre>{healthStatus || 'Loading...'}</pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Login Test:</h2>
        <pre>{loginStatus || 'Loading...'}</pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Vehicles Test:</h2>
        <pre>{vehiclesStatus || 'Waiting for login...'}</pre>
      </div>
    </div>
  );
};

export default DebugAPI;
