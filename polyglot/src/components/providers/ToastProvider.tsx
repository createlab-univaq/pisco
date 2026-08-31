'use client';

import React, { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import styles from './ToastProvider.module.css';

export type ToastType = {
    id: number;
    title: string;
    description: string;
    status: 'success' | 'warning' | 'error';
};

interface ToastContextType {
    showToast: (title: string, description: string, status: 'success' | 'warning' | 'error') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<ToastType[]>([]);
    const counterRef = useRef(0);

    const showToast = useCallback((title: string, description: string, status: 'success' | 'warning' | 'error') => {
        const id = ++counterRef.current;
        setToasts((prev) => [...prev, { id, title, description, status }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className={styles.toastContainer}>
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`${styles.toast} ${t.status === 'success'
                                ? styles.toastSuccess
                                : t.status === 'warning'
                                    ? styles.toastWarning
                                    : styles.toastError
                            }`}
                    >
                        <div className={styles.toastTitle}>{t.title}</div>
                        <div className={styles.toastDesc}>{t.description}</div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};