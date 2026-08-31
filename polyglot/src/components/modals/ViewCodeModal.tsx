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
                        const result = validateNodeData(node.type, node.data);
                        if (!result.ok) {
                            result.errors.forEach(e => {
                                currentSchemaErrors.push(`Node #${idx} (${node.title || node.type}) - [${e.path}]: ${e.message}`);
                            });
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
            if (parsedFlow?.nodes && Array.isArray(parsedFlow.nodes)) {
                parsedFlow.nodes.forEach((node: any, idx: number) => {
                    if (node.type && node.data) {
                        const result = validateNodeData(node.type, node.data);
                        if (!result.ok) {
                            result.errors.forEach(e => {
                                currentSchemaErrors.push(`Node #${idx} (${node.title || node.type}) - [${e.path}]: ${e.message}`);
                            });
                        }
                    }
                });
            }
            setSchemaErrors(currentSchemaErrors);
        } catch (err: any) {
            setJsonError(err.message);
            setSchemaErrors([]);
        }
    };

    const handleSave = () => {
        try {
            const parsedFlow = JSON.parse(editorValue);

            let currentSchemaErrors: string[] = [];
            if (parsedFlow?.nodes && Array.isArray(parsedFlow.nodes)) {
                parsedFlow.nodes.forEach((node: any, idx: number) => {
                    if (node.type && node.data) {
                        const result = validateNodeData(node.type, node.data);
                        if (!result.ok) {
                            result.errors.forEach(e => {
                                currentSchemaErrors.push(`Node #${idx} (${node.title || node.type}) - [${e.path}]: ${e.message}`);
                            });
                        }
                    }
                });
            }

            if (currentSchemaErrors.length > 0) {
                setSchemaErrors(currentSchemaErrors);
                return;
            }

            onApplyChanges(parsedFlow);
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

                {!jsonError && schemaErrors.length > 0 && (
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
                        disabled={!!jsonError || schemaErrors.length > 0}
                        onClick={handleSave}
                    >
                        Apply Changes
                    </button>
                </div>
            </div>
        </div>
    );
}