'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import TextField from '@/components/forms/TextField';
import { loginAction, registerAction } from '@/lib/actions/auth';
import brandLogo from '@public/solo_logo.png';
import styles from './page.module.css';

export default function LoginPage() {
    const router = useRouter();
    const [isLoginView, setIsLoginView] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const toggleView = () => {
        setIsLoginView(!isLoginView);
        setGlobalError(null);
        setSuccessMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setGlobalError(null);
        setSuccessMessage(null);

        const formData = new FormData(e.currentTarget);
        const password = formData.get('password') as string;

        if (!isLoginView) {
            const confirmPassword = formData.get('confirmPassword') as string;
            if (password !== confirmPassword) {
                setGlobalError('Le password non coincidono.');
                return;
            }
        }

        setIsLoading(true);

        try {
            if (isLoginView) {
                // LOGIN FLOW
                const result = await loginAction(formData);

                if (result.error) {
                    setGlobalError(result.error);
                } else if (result.success) {
                    router.push('/flows');
                }
            } else {
                // REGISTER FLOW
                const result = await registerAction(formData);

                if (result.error) {
                    setGlobalError(result.error);
                } else if (result.success) {
                    // Switch to login view and show success message
                    setIsLoginView(true);
                    setSuccessMessage('Account creato con successo! Ora puoi accedere.');
                    e.currentTarget.reset(); // Clear the form
                }
            }
        } catch (error) {
            setGlobalError('Si è verificato un errore imprevisto. Riprova.');
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
                    {isLoginView ? 'Bentornato' : 'Crea un account'}
                </h1>
                <p className={styles.subtitle}>
                    {isLoginView
                        ? 'Inserisci i tuoi dati per accedere.'
                        : 'Registrati per iniziare a creare percorsi interattivi.'}
                </p>

                {globalError && (
                    <div className={styles.errorText} aria-live="polite" role="alert">
                        {globalError}
                    </div>
                )}

                {successMessage && (
                    <div className={styles.successText} aria-live="polite" role="status">
                        {successMessage}
                    </div>
                )}

                <form className={styles.form} onSubmit={handleSubmit}>
                    {!isLoginView && (
                        <>
                            <TextField
                                label="Nome"
                                name="firstName"
                                isDisabled={isLoading}
                                required
                            />
                            <TextField
                                label="Cognome"
                                name="lastName"
                                isDisabled={isLoading}
                                required
                            />
                        </>
                    )}

                    <TextField
                        label="Indirizzo Email"
                        name="email"
                        type="email"
                        isDisabled={isLoading}
                        required
                    />

                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        isDisabled={isLoading}
                        required
                    />

                    {!isLoginView && (
                        <TextField
                            label="Conferma Password"
                            name="confirmPassword"
                            type="password"
                            isDisabled={isLoading}
                            required
                        />
                    )}

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? 'Elaborazione...'
                            : isLoginView ? 'Accedi' : 'Registrati'
                        }
                    </button>
                </form>

                <div className={styles.toggleContainer}>
                    {isLoginView ? "Non hai un account? " : "Hai già un account? "}
                    <button
                        type="button"
                        className={styles.toggleBtn}
                        onClick={toggleView}
                        disabled={isLoading}
                    >
                        {isLoginView ? 'Registrati' : 'Accedi'}
                    </button>
                </div>
            </div>
        </div>
    );
}