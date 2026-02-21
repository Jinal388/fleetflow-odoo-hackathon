import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Phone, Shield, ArrowRight } from 'lucide-react';

const signupSchema = z.object({
    fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
    email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
    phone: z.string().min(10, { message: 'Invalid phone number' }).max(15, { message: 'Invalid phone number' }),
    role: z.union([z.literal('MANAGER'), z.literal('DISPATCHER'), z.literal('DRIVER')]),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' })
        .regex(/[A-Z]/, { message: 'Must contain an uppercase letter' })
        .regex(/[0-9]/, { message: 'Must contain a number' }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: { role: 'MANAGER' }
    });

    const onSubmit = async (data: SignupFormValues) => {
        try {
            const response = await fetch('http://localhost:5000/api/fleetflow/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                    name: data.fullName,
                    role: data.role
                })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Registration failed');

            navigate('/auth/verify-otp', { state: { email: data.email } });
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans">

            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-sidebar-background overflow-hidden items-center justify-center p-12">
                <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-transparent to-transparent flex items-center justify-center pointer-events-none">
                    <div className="w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent absolute"></div>
                </div>

                <div className="relative z-10 w-full max-w-lg space-y-8">
                    <Link to="/" className="flex items-center gap-4 hover:opacity-90 transition-opacity w-fit">
                        <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-indigo-300 drop-shadow-sm">VahanSetu</h1>

                    </Link>

                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-white leading-tight">
                            Scale your fleet operations<br />with confidence.
                        </h2>
                        <p className="text-sidebar-foreground text-lg leading-relaxed max-w-md">
                            Join thousands of logistics companies streamlining their dispatch, maintenance, and analytics in one unified platform.
                        </p>
                    </div>

                </div>
            </div>

            {/* Right Panel - Signup Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
                <div className="w-full max-w-md space-y-8 py-8">

                    <div className="lg:hidden flex justify-center mb-8">
                        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600 drop-shadow-sm">VahanSetu</h1>
                    </div>

                    <div className="text-center lg:text-left space-y-2">
                        <h2 className="text-3xl font-extrabold tracking-tight">Create an account</h2>
                        <p className="text-muted-foreground text-sm">
                            Enter your information to set up your organization workspace.
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-4">

                            {/* Full Name */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium leading-none">Full Name</label>
                                <div className="relative group">
                                    <UserIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.fullName ? 'text-destructive' : 'text-muted-foreground group-focus-within:text-primary'} `} />
                                    <input
                                        type="text"
                                        {...register('fullName')}
                                        className={`flex h-11 w-full rounded-xl border ${errors.fullName ? 'border-destructive focus:ring-destructive/20' : 'border-input focus:border-primary focus:ring-primary/20'} bg-transparent pl-11 pr-4 py-2 text-sm shadow-sm transition-all focus:outline-none focus:ring-2`}
                                        placeholder="John Doe"
                                    />
                                    {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName.message}</p>}
                                </div>
                            </div>

                            {/* Email Address */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium leading-none">Corporate Email</label>
                                <div className="relative group">
                                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.email ? 'text-destructive' : 'text-muted-foreground group-focus-within:text-primary'} `} />
                                    <input
                                        type="email"
                                        {...register('email')}
                                        className={`flex h-11 w-full rounded-xl border ${errors.email ? 'border-destructive focus:ring-destructive/20' : 'border-input focus:border-primary focus:ring-primary/20'} bg-transparent pl-11 pr-4 py-2 text-sm shadow-sm transition-all focus:outline-none focus:ring-2`}
                                        placeholder="john@company.com"
                                    />
                                    {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium leading-none">Phone Number</label>
                                <div className="relative group">
                                    <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.phone ? 'text-destructive' : 'text-muted-foreground group-focus-within:text-primary'} `} />
                                    <input
                                        type="tel"
                                        {...register('phone')}
                                        className={`flex h-11 w-full rounded-xl border ${errors.phone ? 'border-destructive focus:ring-destructive/20' : 'border-input focus:border-primary focus:ring-primary/20'} bg-transparent pl-11 pr-4 py-2 text-sm shadow-sm transition-all focus:outline-none focus:ring-2`}
                                        placeholder="+1 (555) 000-0000"
                                    />
                                    {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
                                </div>
                            </div>

                            {/* Role Selection */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium leading-none">Primary Role</label>
                                <div className="relative group">
                                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <select
                                        {...register('role')}
                                        className="flex h-11 w-full rounded-xl border border-input bg-transparent px-11 py-2 text-sm shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none bg-no-repeat"
                                        style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
                                    >
                                        <option value="MANAGER">Fleet Manager</option>
                                        <option value="DISPATCHER">Dispatcher</option>
                                        <option value="DRIVER">Driver</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Password */}
                                <div className="space-y-1">
                                    <label className="text-sm font-medium leading-none">Password</label>
                                    <div className="relative group">
                                        <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.password ? 'text-destructive' : 'text-muted-foreground group-focus-within:text-primary'} `} />
                                        <input
                                            type="password"
                                            {...register('password')}
                                            className={`flex h-11 w-full rounded-xl border ${errors.password ? 'border-destructive focus:ring-destructive/20' : 'border-input focus:border-primary focus:ring-primary/20'} bg-transparent pl-11 pr-4 py-2 text-sm shadow-sm transition-all focus:outline-none focus:ring-2`}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    {errors.password && <p className="text-xs text-destructive mt-1 wrap-break-word">{errors.password.message}</p>}
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-1">
                                    <label className="text-sm font-medium leading-none">Confirm Password</label>
                                    <div className="relative group">
                                        <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.confirmPassword ? 'text-destructive' : 'text-muted-foreground group-focus-within:text-primary'} `} />
                                        <input
                                            type="password"
                                            {...register('confirmPassword')}
                                            className={`flex h-11 w-full rounded-xl border ${errors.confirmPassword ? 'border-destructive focus:ring-destructive/20' : 'border-input focus:border-primary focus:ring-primary/20'} bg-transparent pl-11 pr-4 py-2 text-sm shadow-sm transition-all focus:outline-none focus:ring-2`}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    {errors.confirmPassword && <p className="text-xs text-destructive mt-1 wrap-break-word">{errors.confirmPassword.message}</p>}
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow transition-all hover:bg-primary/90 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {isSubmitting ? 'Creating account...' : 'Create Account'}
                            {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground mt-8">
                        Already have an account?{' '}
                        <Link to="/auth/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                            Sign in
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
};

export default Signup;
