'use client';

import Editor from '@monaco-editor/react';
import { useState, useEffect } from 'react';
import styles from './ElementProperties.module.css';
import { PolyglotNode } from '@/types/PolyglotNode';
import { PolyglotEdge } from '@/types/PolyglotEdge';
import { polyglotEdgeComponentMapping, polyglotNodeComponentMapping } from '../ElementMapping';
import { useHasHydrated } from '@/hooks/useHasHydrated';
import { validateNodeData } from '@/lib/validation/nodeValidator';

export type ElementPropertiesProps = {
    selectedElement: PolyglotNode | PolyglotEdge;
    children?: React.ReactNode;
    onUpdateElement?: (updatedElement: any) => void;
};

const ElementProperties = ({
    selectedElement,
    children,
    onUpdateElement,
}: ElementPropertiesProps) => {
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const hydrated = useHasHydrated();

    const [editorValue, setEditorValue] = useState('');
    const [jsonError, setJsonError] = useState<string | null>(null);
    const [schemaErrors, setSchemaErrors] = useState<string[]>([]);

    const ElementProperty = (selectedElement.type.includes('Node')
        ? polyglotNodeComponentMapping.getElementPropertiesComponent(selectedElement.type)
        : polyglotEdgeComponentMapping.getElementPropertiesComponent(selectedElement.type)) as React.ElementType<any>;

    const handleFieldChange = (field: string, value: any) => {
        if (onUpdateElement) {
            onUpdateElement({ ...selectedElement, [field]: value });
        }
    };

    useEffect(() => {
        if (isEditorOpen) {
            setEditorValue(JSON.stringify(selectedElement, null, 4));
            setJsonError(null);

            let currentSchemaErrors: string[] = [];
            if (selectedElement.type && !selectedElement.type.includes('Edge') && 'data' in selectedElement) {
                const validationResult = validateNodeData(selectedElement.type, (selectedElement as PolyglotNode).data);
                currentSchemaErrors = validationResult.errors.map(e => `[${e.path}]: ${e.message}`);
            }
            setSchemaErrors(currentSchemaErrors);
        }
        // Depend on _id and isEditorOpen, NOT the whole selectedElement object.
        // This prevents the editor from resetting its cursor while you type.
    }, [selectedElement._id, isEditorOpen]);

    const handleEditorChange = (value: string | undefined) => {
        const text = value || '';
        setEditorValue(text);

        try {
            const parsedElement = JSON.parse(text);
            setJsonError(null);

            let currentSchemaErrors: string[] = [];
            if (parsedElement.type && !parsedElement.type.includes('Edge')) {
                const validationResult = validateNodeData(parsedElement.type, parsedElement.data);
                currentSchemaErrors = validationResult.errors.map(e => `[${e.path}]: ${e.message}`);
            }
            setSchemaErrors(currentSchemaErrors);

            if (onUpdateElement) {
                onUpdateElement(parsedElement);
            }
        } catch (err: any) {
            setJsonError(err.message);
            setSchemaErrors([]);
        }
    };

    const displayTitle = 'title' in selectedElement ? selectedElement.title : 'Edge Properties';

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.heading}>{displayTitle}</h2>
                <button
                    className={styles.toggleButton}
                    onClick={() => setIsEditorOpen(!isEditorOpen)}
                >
                    {isEditorOpen ? 'Return to Form' : 'View Code'}
                </button>
            </div>

            {isEditorOpen ? (
                <div
                    className={styles.editorContainer}
                    onKeyDown={(e) => {
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                    }}
                >
                    {jsonError && (
                        <div className={styles.errorBanner}>
                            Invalid JSON: {jsonError}
                        </div>
                    )}

                    <Editor
                        options={{
                            readOnly: false,
                            minimap: { enabled: false },
                            formatOnPaste: true,
                            tabSize: 4
                        }}
                        height="calc(100vh - 120px)"
                        language="json"
                        value={editorValue}
                        onChange={handleEditorChange}
                    />
                </div>
            ) : (
                <div className={styles.formContainer}>
                    {hydrated && ElementProperty && (
                        <ElementProperty
                            element={selectedElement}
                            onUpdateElement={onUpdateElement}
                            type={selectedElement.type}
                            onChange={handleFieldChange}
                        />
                    )}
                    {children}
                </div>
            )}
        </div>
    );
};

export default ElementProperties;