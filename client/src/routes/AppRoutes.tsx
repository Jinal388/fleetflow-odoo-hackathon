import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/user/auth/Login';
import Signup from '../pages/user/auth/Signup';
import VerifyOTP from '../pages/user/auth/VerifyOTP';
import ForgotPassword from '../pages/user/auth/ForgotPassword';
import ResetPassword from '../pages/user/auth/ResetPassword';
import UserRoutes from './UserRoutes';
import AdminRoutes from './AdminRoutes';
import Home from '../pages/home/Home';

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Landing Page Route */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Navigate to="/" replace />} />

            {/* Authentication Routes */}
            <Route path="/auth">
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route path="verify-otp" element={<VerifyOTP />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="reset-password" element={<ResetPassword />} />
                <Route index element={<Navigate to="/auth/login" replace />} />
            </Route>

            {/* User Module Routes */}
            <Route path="/user/*" element={<UserRoutes />} />

            {/* Admin Module Routes */}
            <Route path="/admin/*" element={<AdminRoutes />} />

            {/* 404 Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
