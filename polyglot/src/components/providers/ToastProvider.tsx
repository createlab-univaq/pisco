'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react';
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

// ============================================================================
// INDIVIDUAL TOAST COMPONENT (Handles its own hover/timeout logic)
// ============================================================================
const ToastItem = ({ toast, onRemove }: { toast: ToastType; onRemove: (id: number) => void }) => {
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startTimer = useCallback(() => {
        timerRef.current = setTimeout(() => {
            onRemove(toast.id);
        }, 4000);
    }, [onRemove, toast.id]);

    const stopTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    // Start timer on mount, clean up on unmount
    useEffect(() => {
        startTimer();
        return () => stopTimer();
    }, [startTimer, stopTimer]);

    return (
        <div
            className={`${styles.toast} ${toast.status === 'success'
                    ? styles.toastSuccess
                    : toast.status === 'warning'
                        ? styles.toastWarning
                        : styles.toastError
                }`}
            onMouseEnter={stopTimer}
            onMouseLeave={startTimer}
        >
            <div className={styles.toastTitle}>{toast.title}</div>
            <div className={styles.toastDesc}>{toast.description}</div>
        </div>
    );
};

// ============================================================================
// TOAST PROVIDER
// ============================================================================
export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<ToastType[]>([]);
    const counterRef = useRef(0);

    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback((title: string, description: string, status: 'success' | 'warning' | 'error') => {
        const id = ++counterRef.current;
        // Just add the toast. The ToastItem component will handle its own timeout.
        setToasts((prev) => [...prev, { id, title, description, status }]);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className={styles.toastContainer}>
                {toasts.map((t) => (
                    <ToastItem
                        key={t.id}
                        toast={t}
                        onRemove={removeToast}
                    />
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