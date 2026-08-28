'use client';

import Editor from '@monaco-editor/react';
import { useState, useEffect } from 'react';
import styles from './ElementProperties.module.css';
import { PolyglotNode } from '@/types/PolyglotNode';
import { PolyglotEdge } from '@/types/PolyglotEdge';
import { polyglotEdgeComponentMapping, polyglotNodeComponentMapping } from '../ElementMapping';
import { useHasHydrated } from '@/utils/useClientUtils';

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

    // State to hold the active text in the Monaco Editor
    const [editorValue, setEditorValue] = useState('');
    const [jsonError, setJsonError] = useState<string | null>(null);

    const ElementProperty = (selectedElement.type.includes('Node')
        ? polyglotNodeComponentMapping.getElementPropertiesComponent(selectedElement.type)
        : polyglotEdgeComponentMapping.getElementPropertiesComponent(selectedElement.type)) as React.ElementType<any>;

    const handleFieldChange = (field: string, value: any) => {
        if (onUpdateElement) {
            onUpdateElement({ ...selectedElement, [field]: value });
        }
    };

    // When the user switches elements OR opens the code view, refresh the JSON string
    useEffect(() => {
        if (isEditorOpen) {
            setEditorValue(JSON.stringify(selectedElement, null, 4));
            setJsonError(null);
        }
        // We strictly depend on the element ID so typing in the editor doesn't cause a re-render loop
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedElement._id, isEditorOpen]);

    // Handle typing inside the Monaco Editor
    const handleEditorChange = (value: string | undefined) => {
        const text = value || '';
        setEditorValue(text);

        try {
            const parsedElement = JSON.parse(text);
            setJsonError(null); // Clear error if valid

            // Push the valid JSON to the main flow editor instantly
            if (onUpdateElement) {
                onUpdateElement(parsedElement);
            }
        } catch (err: any) {
            // Catch JSON syntax errors and display them without crashing the app
            setJsonError(err.message);
        }
    };

    const displayTitle = 'title' in selectedElement ? selectedElement.title : 'Edge Properties';

    return (
        <div className={styles.container}>
            {/* STICKY HEADER */}
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
                <div className={styles.editorContainer}>
                    {/* Display JSON validation errors */}
                    {jsonError && (
                        <div className={styles.errorBanner}>
                            Invalid JSON: {jsonError}
                        </div>
                    )}

                    <Editor
                        options={{
                            readOnly: false, // Unlock the editor!
                            minimap: { enabled: false },
                            formatOnPaste: true,
                            tabSize: 4
                        }}
                        height="calc(100vh - 120px)" // Fill the sidebar height
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