import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const otpSchema = z.object({
    otp: z.string().length(6, { message: 'OTP must be exactly 6 digits.' }).regex(/^\d+$/, { message: 'OTP must contain only numbers.' }),
});

type OTPFormValues = z.infer<typeof otpSchema>;

const VerifyOTP: React.FC = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<OTPFormValues>({
        resolver: zodResolver(otpSchema),
    });

    const location = useLocation();
    const email = location.state?.email || '';

    const onSubmit = async (data: OTPFormValues) => {
        try {
            if (!email) throw new Error('Email not found. Please register again.');

            const response = await fetch('http://localhost:5000/api/fleetflow/auth/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: data.otp })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Verification failed');

            navigate('/auth/login');
        } catch (error: any) {
            alert(error.message);
        }
    };

    const handleResend = async () => {
        if (!email) return alert('No email found to resend to.');
        try {
            const response = await fetch('http://localhost:5000/api/fleetflow/auth/resend-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to resend code');
            alert('Verification code resent successfully!');
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
                    Verify your Email
                </h2>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                    We sent a 6-digit code to your email. Enter it below to activate your account.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-card py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-border">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-foreground">
                                6-Digit Security Code
                            </label>
                            <div className="mt-2">
                                <input
                                    id="otp"
                                    type="text"
                                    maxLength={6}
                                    placeholder="000000"
                                    {...register('otp')}
                                    className={`block w-full appearance-none rounded-xl border ${errors.otp ? 'border-destructive focus:border-destructive focus:ring-destructive' : 'border-input focus:border-primary focus:ring-primary'} px-4 py-3 text-center text-2xl tracking-[0.5em] placeholder-muted-foreground shadow-sm focus:outline-none focus:ring-2 sm:text-2xl transition-colors bg-background`}
                                />
                                {errors.otp && (
                                    <p className="mt-2 text-sm text-destructive">{errors.otp.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group flex w-full justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all disabled:opacity-70"
                            >
                                {isSubmitting ? 'Verifying...' : 'Verify & Continue'}
                                {!isSubmitting && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </div>

                        <div className="text-center">
                            <button type="button" onClick={handleResend} className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                                Resend Code
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;
