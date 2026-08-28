'use client';

import { ReactNode } from 'react';
import styles from './EditorCardWrapper.module.css';

const CloseIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export type EditorCardWrapperProps = {
    title: string;
    children: ReactNode;
    onRemove?: () => void;
    isDeleting?: boolean;
    removeLabel?: string;
};

export const EditorCardWrapper = ({
    title,
    children,
    onRemove,
    isDeleting,
    removeLabel = "Rimuovi"
}: EditorCardWrapperProps) => {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h5 className={styles.cardTitle}>{title}</h5>
                {onRemove && (
                    <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={onRemove}
                        disabled={isDeleting}
                        title={removeLabel}
                        aria-label={removeLabel}
                    >
                        {isDeleting ? '...' : <CloseIcon />}
                        <span className={styles.removeText}>{removeLabel}</span>
                    </button>
                )}
            </div>

            {/* The specific node's form fields are injected here */}
            {children}
        </div>
    );
};

// Export a generic divider so you don't have to rewrite it in every CSS file
export const EditorCardDivider = () => <hr className={styles.innerDivider} />;