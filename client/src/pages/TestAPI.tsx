import React, { useState } from 'react';
import vehicleService from '../services/vehicleService';
import driverService from '../services/driverService';
import tripService from '../services/tripService';

const TestAPI: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testVehicles = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await vehicleService.getAllVehicles();
      setResult({ success: true, count: data.length, data });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch vehicles');
      setResult({ success: false, error: err.response?.data || err.message });
    } finally {
      setLoading(false);
    }
  };

  const testDrivers = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await driverService.getAllDrivers();
      setResult({ success: true, count: data.length, data });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch drivers');
      setResult({ success: false, error: err.response?.data || err.message });
    } finally {
      setLoading(false);
    }
  };

  const testTrips = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await tripService.getAllTrips();
      setResult({ success: true, count: data.length, data });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch trips');
      setResult({ success: false, error: err.response?.data || err.message });
    } finally {
      setLoading(false);
    }
  };

  const testCreateVehicle = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const newVehicle = {
        name: 'Test Vehicle ' + Date.now(),
        registrationNumber: 'TEST-' + Date.now(),
        licensePlate: 'TEST-' + Date.now(),
        make: 'Honda',
        vehicleModel: 'CR-V',
        year: 2024,
        fuelType: 'petrol' as const,
        capacity: 5,
        maxLoadCapacity: 800,
        odometer: 0,
        mileage: 0,
        acquisitionCost: 30000,
      };
      const data = await vehicleService.createVehicle(newVehicle);
      setResult({ success: true, message: 'Vehicle created!', data });
    } catch (err: any) {
      setError(err.message || 'Failed to create vehicle');
      setResult({ success: false, error: err.response?.data || err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Test Page</h1>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <h2 className="font-semibold mb-2">Environment Info:</h2>
        <p><strong>API URL:</strong> {import.meta.env.VITE_API_URL || 'Not set'}</p>
        <p><strong>Token:</strong> {localStorage.getItem('token') ? 'Present' : 'Missing'}</p>
        <p><strong>User:</strong> {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).email : 'Not logged in'}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={testVehicles}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Test Get Vehicles
        </button>

        <button
          onClick={testDrivers}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Test Get Drivers
        </button>

        <button
          onClick={testTrips}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          Test Get Trips
        </button>

        <button
          onClick={testCreateVehicle}
          disabled={loading}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
        >
          Test Create Vehicle
        </button>
      </div>

      {loading && (
        <div className="p-4 bg-gray-100 rounded">
          <p>Loading...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded mb-4">
          <h3 className="font-semibold text-red-800">Error:</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {result && (
        <div className="p-4 bg-gray-50 border rounded">
          <h3 className="font-semibold mb-2">Result:</h3>
          <pre className="text-xs overflow-auto max-h-96 bg-white p-2 rounded">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestAPI;
