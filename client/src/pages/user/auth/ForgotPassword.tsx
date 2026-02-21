import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const forgotPasswordSchema = z.object({
    email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
    const [isSent, setIsSent] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        try {
            const response = await fetch('http://localhost:5000/api/fleetflow/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: data.email })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to send reset link');

            setIsSent(true);
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                        <Mail className="w-8 h-8 text-amber-500" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
                    {isSent ? 'Check your inbox' : 'Reset your password'}
                </h2>
                <p className="mt-2 text-center text-sm text-muted-foreground px-4">
                    {isSent
                        ? 'We have sent a password reset link to your email address. It will expire in 30 minutes.'
                        : 'Enter the email address associated with your account and we will send you a link to reset your password.'}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-card py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-border">
                    {!isSent ? (
                        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        {...register('email')}
                                        className={`block w-full appearance-none rounded-xl border ${errors.email ? 'border-destructive focus:border-destructive' : 'border-input focus:border-primary'} px-4 py-3 placeholder-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm transition-colors bg-background`}
                                    />
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-destructive">{errors.email.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70"
                                >
                                    {isSubmitting ? 'Sending...' : 'Send reset link'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center">
                            <Link
                                to="/auth/login"
                                className="w-full flex justify-center py-3 px-4 border border-input rounded-xl shadow-sm text-sm font-medium text-foreground bg-card hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                                Return to login
                            </Link>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <Link to="/auth/login" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-1.5" />
                            Back to log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
