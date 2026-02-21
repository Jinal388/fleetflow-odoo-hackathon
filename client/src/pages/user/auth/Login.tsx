import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const response = await fetch('http://localhost:5000/api/fleetflow/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Login failed');

            if (result.data && result.data.token) {
                localStorage.setItem('token', result.data.token);
            }

            if (result.data?.user?.role === 'SYSTEM_ADMIN' || data.email.includes('admin')) {
                navigate('/admin/dashboard');
            } else {
                navigate('/user/dashboard');
            }
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans">
            {/* Left Panel - Branding (Hidden on Mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-sidebar-background overflow-hidden items-center justify-center p-12">
                <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-transparent to-transparent flex items-center justify-center pointer-events-none">
                    <div className="w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent absolute"></div>
                </div>

                <div className="relative z-10 w-full max-w-lg space-y-8">
                    <div className="flex items-center gap-4">
                        <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-indigo-300 drop-shadow-sm">VahanSetu</h1>

                    </div>

                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-white leading-tight">
                            Smarter Logistics.<br />Simplified Management.
                        </h2>
                        <p className="text-sidebar-foreground text-lg leading-relaxed max-w-md">
                            Optimize dispatching, monitor vehicle health, and manage your entire fleet in real-time from one unified command center.
                        </p>
                    </div>


                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
                <div className="w-full max-w-md space-y-8">

                    <div className="lg:hidden flex justify-center mb-8">
                        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600 drop-shadow-sm">VahanSetu</h1>
                    </div>

                    <div className="text-center lg:text-left space-y-2">
                        <h2 className="text-3xl font-extrabold tracking-tight">Welcome back</h2>
                        <p className="text-muted-foreground text-sm">
                            Please enter your details to access your dashboard.
                        </p>
                    </div>

                    <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            {/* Email Address */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.email ? 'text-destructive' : 'text-muted-foreground group-focus-within:text-primary'} `} />
                                    <input
                                        type="email"
                                        {...register('email')}
                                        className={`flex h-12 w-full rounded-xl border ${errors.email ? 'border-destructive focus:ring-destructive/20' : 'border-input focus:border-primary focus:ring-primary/20'} bg-transparent pl-11 pr-4 py-2 text-sm shadow-sm transition-all focus:outline-none focus:ring-2`}
                                        placeholder="name@vahansetu.com"
                                    />
                                    {errors.email && <p className="text-xs text-destructive mt-1 absolute -bottom-5 left-1">{errors.email.message}</p>}
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1 pt-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium leading-none">Password</label>
                                    <Link to="/auth/forgot-password" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.password ? 'text-destructive' : 'text-muted-foreground group-focus-within:text-primary'} `} />
                                    <input
                                        type="password"
                                        {...register('password')}
                                        className={`flex h-12 w-full rounded-xl border ${errors.password ? 'border-destructive focus:ring-destructive/20' : 'border-input focus:border-primary focus:ring-primary/20'} bg-transparent pl-11 pr-4 py-2 text-sm shadow-sm transition-all focus:outline-none focus:ring-2`}
                                        placeholder="••••••••"
                                    />
                                    {errors.password && <p className="text-xs text-destructive mt-1 absolute -bottom-5 left-1">{errors.password.message}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                            <input type="checkbox" id="remember" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                            <label htmlFor="remember" className="text-sm text-foreground font-medium leading-none cursor-pointer">
                                Remember me for 30 days
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow transition-all hover:bg-primary/90 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign in to VahanSetu'}
                            {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground mt-8">
                        Don't have an account?{' '}
                        <Link to="/auth/signup" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                            Request access
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
};

export default Login;
