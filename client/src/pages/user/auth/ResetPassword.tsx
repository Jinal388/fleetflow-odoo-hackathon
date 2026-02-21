import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { KeyRound, ArrowRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const resetPasswordSchema = z.object({
    email: z.string().email({ message: 'Valid email required' }),
    otp: z.string().length(6, { message: 'OTP must be 6 digits' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' })
        .regex(/[A-Z]/, { message: 'Must contain an uppercase letter' })
        .regex(/[0-9]/, { message: 'Must contain a number' }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const routerEmail = location.state?.email || '';

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { email: routerEmail }
    });

    const onSubmit = async (data: ResetPasswordFormValues) => {
        try {
            const response = await fetch('http://localhost:5000/api/fleetflow/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: data.email,
                    otp: data.otp,
                    newPassword: data.password
                })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to reset password');

            alert('Password reset successful! You can now log in.');
            navigate('/auth/login');
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <KeyRound className="w-8 h-8 text-primary" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
                    Set new password
                </h2>
                <p className="mt-2 text-center text-sm text-muted-foreground px-4">
                    Your new password must be different to previously used passwords.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-card py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-border">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground">
                                    Email Address
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="email"
                                        {...register('email')}
                                        className={`block w-full appearance-none rounded-xl border ${errors.email ? 'border-destructive focus:border-destructive' : 'border-input focus:border-primary'} px-4 py-3 placeholder-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm transition-colors bg-background`}
                                        placeholder="name@vahansetu.com"
                                    />
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-destructive">{errors.email.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground">
                                    6-Digit OTP
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        {...register('otp')}
                                        maxLength={6}
                                        className={`block w-full appearance-none rounded-xl border ${errors.otp ? 'border-destructive focus:border-destructive' : 'border-input focus:border-primary'} px-4 py-3 placeholder-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm transition-colors bg-background`}
                                        placeholder="000000"
                                    />
                                    {errors.otp && (
                                        <p className="mt-2 text-sm text-destructive">{errors.otp.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground">
                                    New Password
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="password"
                                        {...register('password')}
                                        className={`block w-full appearance-none rounded-xl border ${errors.password ? 'border-destructive focus:border-destructive' : 'border-input focus:border-primary'} px-4 py-3 placeholder-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm transition-colors bg-background`}
                                        placeholder="••••••••"
                                    />
                                    {errors.password && (
                                        <p className="mt-2 text-sm text-destructive">{errors.password.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground">
                                    Confirm Password
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="password"
                                        {...register('confirmPassword')}
                                        className={`block w-full appearance-none rounded-xl border ${errors.confirmPassword ? 'border-destructive focus:border-destructive' : 'border-input focus:border-primary'} px-4 py-3 placeholder-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm transition-colors bg-background`}
                                        placeholder="••••••••"
                                    />
                                    {errors.confirmPassword && (
                                        <p className="mt-2 text-sm text-destructive">{errors.confirmPassword.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70"
                            >
                                {isSubmitting ? 'Resetting password...' : 'Reset password'}
                                {!isSubmitting && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
