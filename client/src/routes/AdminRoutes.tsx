import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/layouts/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminVehicles from '../pages/admin/AdminVehicles';
import AdminTrips from '../pages/admin/AdminTrips';
import AdminMaintenance from '../pages/admin/AdminMaintenance';
import AdminExpenses from '../pages/admin/AdminExpenses';
import AdminDrivers from '../pages/admin/AdminDrivers';
import AdminAnalytics from '../pages/admin/AdminAnalytics';

const AdminRoutes: React.FC = () => {
    return (
        <Routes>
            <Route element={<AdminLayout />}>
                <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/vehicles" element={<AdminVehicles />} />
                <Route path="/trips" element={<AdminTrips />} />
                <Route path="/maintenance" element={<AdminMaintenance />} />
                <Route path="/expenses" element={<AdminExpenses />} />
                <Route path="/drivers" element={<AdminDrivers />} />
                <Route path="/analytics" element={<AdminAnalytics />} />
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
