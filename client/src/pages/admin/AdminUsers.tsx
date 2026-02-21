import React, { useState } from 'react';
import { Plus, UserCheck, Mail, Shield } from 'lucide-react';
import userService, { type CreateManagerData } from '../../services/userService';
import authService from '../../services/authService';

const AdminUsers: React.FC = () => {
  const [showAddManager, setShowAddManager] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState<CreateManagerData>({
    email: '',
    password: '',
    name: '',
    role: 'manager',
  });

  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await userService.createManager(formData);
      setSuccess('Manager created successfully! Verification email sent.');
      setFormData({ email: '', password: '', name: '', role: 'manager' });
      setShowAddManager(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create manager');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Access Denied: Only administrators can manage users.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage managers and system users</p>
        </div>
        <button
          onClick={() => setShowAddManager(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Manager
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="text-blue-600 mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-blue-900">Admin Privileges</h3>
            <p className="text-blue-800 text-sm mt-1">
              As an admin, you can create manager accounts. Managers will receive a verification email and must verify their account before logging in.
            </p>
            <p className="text-blue-800 text-sm mt-2">
              <strong>Note:</strong> Admin accounts can only be created via database seeding for security reasons.
            </p>
          </div>
        </div>
      </div>

      {/* Add Manager Modal */}
      {showAddManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Manager</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  minLength={6}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-gray-600" />
                  <span className="text-sm text-gray-700">Role: <strong>Manager</strong></span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddManager(false);
                    setError('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Manager'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Current User Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Current User</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-gray-400" />
            <span className="text-gray-700">{currentUser?.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <UserCheck size={18} className="text-gray-400" />
            <span className="text-gray-700">{currentUser?.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <Shield size={18} className="text-gray-400" />
            <span className="text-gray-700 capitalize">{currentUser?.role}</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Manager Creation Process</h2>
        <ol className="space-y-3 text-gray-700">
          <li className="flex gap-3">
            <span className="font-semibold text-blue-600">1.</span>
            <span>Click "Add Manager" and fill in the manager's details</span>
          </li>
          <li className="flex gap-3">
            <span className="font-semibold text-blue-600">2.</span>
            <span>Manager receives a verification email with a 6-digit OTP</span>
          </li>
          <li className="flex gap-3">
            <span className="font-semibold text-blue-600">3.</span>
            <span>Manager verifies their email using the OTP (valid for 10 minutes)</span>
          </li>
          <li className="flex gap-3">
            <span className="font-semibold text-blue-600">4.</span>
            <span>Manager can then log in and access the system</span>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default AdminUsers;
