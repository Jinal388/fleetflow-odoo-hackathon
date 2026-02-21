import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserLayout from '../components/layouts/UserLayout';
import UserDashboard from '../pages/user/UserDashboard';
import UserVehicles from '../pages/user/UserVehicles';
import UserTrips from '../pages/user/UserTrips';
import UserMaintenance from '../pages/user/UserMaintenance';
import UserExpenses from '../pages/user/UserExpenses';
import UserDrivers from '../pages/user/UserDrivers';
import UserAnalytics from '../pages/user/UserAnalytics';

const UserRoutes: React.FC = () => {
    return (
        <Routes>
            <Route element={<UserLayout />}>
                <Route path="/" element={<Navigate to="/user/dashboard" replace />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/vehicles" element={<UserVehicles />} />
                <Route path="/trips" element={<UserTrips />} />
                <Route path="/maintenance" element={<UserMaintenance />} />
                <Route path="/expenses" element={<UserExpenses />} />
                <Route path="/drivers" element={<UserDrivers />} />
                <Route path="/analytics" element={<UserAnalytics />} />
            </Route>
        </Routes>
    );
};

export default UserRoutes;
