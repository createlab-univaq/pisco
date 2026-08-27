'use client';

import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import styles from './ViewCodeModal.module.css';

type ViewCodeModalProps = {
    isOpen: boolean;
    onClose: () => void;
    flow: any;
    onApplyChanges: (updatedFlow: any) => void;
};

export default function ViewCodeModal({ isOpen, onClose, flow, onApplyChanges }: ViewCodeModalProps) {
    const [editorValue, setEditorValue] = useState('');
    const [jsonError, setJsonError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && flow) {
            setEditorValue(JSON.stringify(flow, null, 4));
            setJsonError(null);
        }
    }, [isOpen, flow]);

    if (!isOpen) return null;

    const handleEditorChange = (value: string | undefined) => {
        setEditorValue(value || '');
        try {
            JSON.parse(value || '');
            setJsonError(null);
        } catch (err: any) {
            setJsonError(err.message);
        }
    };

    const handleSave = () => {
        try {
            const parsedFlow = JSON.parse(editorValue);
            onApplyChanges(parsedFlow); // <-- Use it here
            onClose();
        } catch (err) {
            // Error is already caught and displayed by handleEditorChange
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Edit Flow Code</h2>
                    <button className={styles.closeBtn} onClick={onClose}>✕</button>
                </div>

                {jsonError && (
                    <div className={styles.errorBanner}>Invalid JSON: {jsonError}</div>
                )}

                <div className={styles.editorContainer}>
                    <Editor
                        options={{ minimap: { enabled: false }, formatOnPaste: true, tabSize: 4 }}
                        language="json"
                        value={editorValue}
                        onChange={handleEditorChange}
                    />
                </div>

                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className={styles.saveBtn}
                        disabled={!!jsonError}
                        onClick={handleSave}
                    >
                        Apply Changes
                    </button>
                </div>
            </div>
        </div>
    );
}