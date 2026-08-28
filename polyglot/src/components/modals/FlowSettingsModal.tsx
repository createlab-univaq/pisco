'use client';

import React, { useState, useEffect } from 'react';
import styles from './FlowSettingsModal.module.css';

type FlowSettingsModalProps = {
    isOpen: boolean;
    onClose: () => void;
    flow: any;
    onUpdateFlowInfo?: (updates: any) => void;
};

export default function FlowSettingsModal({ isOpen, onClose, flow, onUpdateFlowInfo }: FlowSettingsModalProps) {
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (isOpen && flow) {
            setDescription(flow.description || '');
        }
    }, [isOpen, flow]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (onUpdateFlowInfo && description !== flow?.description) {
            onUpdateFlowInfo({ description: description.trim() });
        }
        onClose();
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Flow Settings</h2>
                    <button className={styles.closeBtn} onClick={onClose}>✕</button>
                </div>

                <div className={styles.body}>
                    <label className={styles.label} htmlFor="flow-description">
                        Description
                    </label>
                    <textarea
                        id="flow-description"
                        className={styles.textarea}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add a description for this flow..."
                        rows={5}
                    />
                    <p className={styles.hint}>
                        This description helps identify the purpose of the flow and is required before publishing.
                    </p>
                </div>

                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={onClose}>
                        Cancel
                    </button>
                    <button className={styles.saveBtn} onClick={handleSave}>
                        Apply Changes
                    </button>
                </div>
            </div>
        </div>
    );
}