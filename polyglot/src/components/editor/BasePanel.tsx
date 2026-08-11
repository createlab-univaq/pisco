'use client';

import React from 'react';
import styles from './BasePanel.module.css';

export type BasePanelProps = {
    isOpen?: boolean;
    onClose?: () => void;
    onOpen?: () => void;
    children?: React.ReactNode;
};

const BasePanel = ({ children, isOpen }: BasePanelProps) => {
    return (
        <aside
            className={`${styles.panelWrapper} ${isOpen ? styles.panelOpen : ''}`}
            aria-hidden={!isOpen}
        >
            <div className={styles.panelContent}>
                {/* Render children regardless, CSS visibility and opacity will handle hiding it smoothly */}
                {children}
            </div>
        </aside>
    );
};

export default BasePanel;