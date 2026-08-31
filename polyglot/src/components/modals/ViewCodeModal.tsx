'use client';

import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import styles from './ViewCodeModal.module.css';
import { validateNodeData } from '@/lib/validation/nodeValidator';
import { Flow } from '@/types';

type ViewCodeModalProps = {
    isOpen: boolean;
    onClose: () => void;
    flow: Flow;
    onApplyChanges: (updatedFlow: Flow) => void;
};

export default function ViewCodeModal({ isOpen, onClose, flow, onApplyChanges }: ViewCodeModalProps) {
    const [editorValue, setEditorValue] = useState('');
    const [jsonError, setJsonError] = useState<string | null>(null);
    const [schemaErrors, setSchemaErrors] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen && flow) {
            setEditorValue(JSON.stringify(flow, null, 4));
            setJsonError(null);

            let currentSchemaErrors: string[] = [];
            if (flow?.flowJson?.nodes && Array.isArray(flow.flowJson.nodes)) {
                flow.flowJson.nodes.forEach((node: any, idx: number) => {
                    if (node.type && node.data) {
                        try {
                            const result = validateNodeData(node.type, node.data);
                            if (!result.ok) {
                                result.errors.forEach(e => {
                                    currentSchemaErrors.push(`Node #${idx} (${node.title || node.type}) - [${e.path}]: ${e.message}`);
                                });
                            }
                        } catch (valErr) {
                            currentSchemaErrors.push(`Node #${idx} (${node.title || node.type}) - Structure is incomplete or malformed.`);
                        }
                    }
                });
            }
            setSchemaErrors(currentSchemaErrors);
        }
    }, [isOpen, flow]);

    if (!isOpen) return null;

    const handleEditorChange = (value: string | undefined) => {
        const text = value || '';
        setEditorValue(text);
        try {
            const parsedFlow = JSON.parse(text);
            setJsonError(null);

            let currentSchemaErrors: string[] = [];
            const nodesList = parsedFlow?.flowJson?.nodes || parsedFlow?.nodes;
            if (Array.isArray(nodesList)) {
                nodesList.forEach((node: any, idx: number) => {
                    if (node.type && node.data) {
                        try {
                            const result = validateNodeData(node.type, node.data);
                            if (!result.ok) {
                                result.errors.forEach(e => {
                                    currentSchemaErrors.push(`Node #${idx} (${node.title || node.type}) - [${e.path}]: ${e.message}`);
                                });
                            }
                        } catch (valErr) {
                            currentSchemaErrors.push(`Node #${idx} (${node.title || node.type}) - Structure is incomplete or malformed.`);
                        }
                    }
                });
            }
            setSchemaErrors(currentSchemaErrors);
        } catch (err: any) {
            setJsonError(err.message);
        }
    };

    const handleSave = () => {
        try {
            const parsedFlow = JSON.parse(editorValue);

            // Recalculate schema errors for the banner display, but allow applying changes
            let currentSchemaErrors: string[] = [];
            const nodesList = parsedFlow?.flowJson?.nodes || parsedFlow?.nodes;
            if (Array.isArray(nodesList)) {
                nodesList.forEach((node: any, idx: number) => {
                    if (node.type && node.data) {
                        try {
                            const result = validateNodeData(node.type, node.data);
                            if (!result.ok) {
                                result.errors.forEach(e => {
                                    currentSchemaErrors.push(`Node #${idx} (${node.title || node.type}) - [${e.path}]: ${e.message}`);
                                });
                            }
                        } catch (valErr) {
                            currentSchemaErrors.push(`Node #${idx} (${node.title || node.type}) - Structure is incomplete or malformed.`);
                        }
                    }
                });
            }
            setSchemaErrors(currentSchemaErrors);

            onApplyChanges(parsedFlow);
            onClose();
        } catch (err) {
            // Handled by JSON parser check
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

                {schemaErrors.length > 0 && (
                    <div className={styles.errorBanner} style={{ backgroundColor: '#fffaf0', borderColor: '#eebc1d', color: '#744210', maxHeight: '120px', overflowY: 'auto' }}>
                        <strong>Schema Validation Errors:</strong>
                        <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                            {schemaErrors.map((err, idx) => (
                                <li key={idx}>{err}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div
                    className={styles.editorContainer}
                    onKeyDown={(e) => {
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                    }}
                >
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