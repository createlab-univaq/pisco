'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import TextField from '@/components/forms/TextField';
import brandLogo from '@public/solo_logo.png';
import styles from './page.module.css';

export default function LoginPage() {
    const router = useRouter();
    const [isLoginView, setIsLoginView] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setGlobalError(null); // Clear errors when user types
    };

    const toggleView = () => {
        setIsLoginView(!isLoginView);
        setGlobalError(null);
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGlobalError(null);

        // Basic frontend validation
        if (!formData.email || !formData.password) {
            setGlobalError('Please fill in all required fields.');
            return;
        }

        if (!isLoginView && formData.password !== formData.confirmPassword) {
            setGlobalError('Passwords do not match.');
            return;
        }

        setIsLoading(true);

        try {
            if (isLoginView) {
                // TODO: Wire up your actual Login API call here
                console.log('Logging in with:', formData.email, formData.password);

                // Simulate network request
                await new Promise(resolve => setTimeout(resolve, 1000));

                // On success, redirect to flows
                router.push('/flows');
            } else {
                // TODO: Wire up your actual Register API call here
                console.log('Registering with:', formData.name, formData.email, formData.password);

                // Simulate network request
                await new Promise(resolve => setTimeout(resolve, 1000));

                // On success, login and redirect to flows
                router.push('/flows');
            }
        } catch (error) {
            setGlobalError('Authentication failed. Please check your credentials and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.card}>

                <div className={styles.logoContainer}>
                    <Image
                        src={brandLogo}
                        alt="Polyglot Logo"
                        width={48}
                        height={48}
                        priority
                    />
                </div>

                <h1 className={styles.title}>
                    {isLoginView ? 'Welcome back' : 'Create an account'}
                </h1>
                <p className={styles.subtitle}>
                    {isLoginView
                        ? 'Enter your details to access your flows.'
                        : 'Sign up to start building interactive learning nodes.'}
                </p>

                {globalError && (
                    <div className={styles.errorText}>
                        {globalError}
                    </div>
                )}

                <form className={styles.form} onSubmit={handleSubmit}>
                    {!isLoginView && (
                        <TextField
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            isDisabled={isLoading}
                        />
                    )}

                    <TextField
                        label="Email Address"
                        name="email"
                        type="email" // <-- Added this
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        isDisabled={isLoading}
                    />

                    <TextField
                        label="Password"
                        name="password"
                        type="password" // <-- Hides the text as asterisks
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        isDisabled={isLoading}
                    />

                    {!isLoginView && (
                        <TextField
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password" // <-- Hides the text as asterisks
                            value={formData.confirmPassword}
                            onChange={(e) => handleChange('confirmPassword', e.target.value)}
                            isDisabled={isLoading}
                        />
                    )}

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? 'Processing...'
                            : isLoginView ? 'Sign In' : 'Register'
                        }
                    </button>
                </form>

                <div className={styles.toggleContainer}>
                    {isLoginView ? "Don't have an account? " : "Already have an account? "}
                    <button
                        type="button"
                        className={styles.toggleBtn}
                        onClick={toggleView}
                        disabled={isLoading}
                    >
                        {isLoginView ? 'Sign up' : 'Log in'}
                    </button>
                </div>

            </div>
        </div>
    );
}