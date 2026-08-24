'use client';

import Editor from '@monaco-editor/react';
import { useState } from 'react';
import styles from './ElementProperties.module.css';
import { PolyglotNode } from '@/types/polyglot-elements/PolyglotNode';
import { PolyglotEdge } from '@/types/polyglot-elements/PolyglotEdge';
import { polyglotEdgeComponentMapping, polyglotNodeComponentMapping } from '../ElementMapping';
import { useHasHydrated } from '@/utils/utils';
import BasePanel from './BasePanel';

export type ElementPropertiesProps = {
    selectedElement?: PolyglotNode | PolyglotEdge | null;
    children?: React.ReactNode;
    isOpen?: boolean;
    onClose: () => void;
    onUpdateElement?: (updatedElement: any) => void;
};

const ElementProperties = ({
    selectedElement,
    isOpen,
    onClose,
    children,
    onUpdateElement,
}: ElementPropertiesProps) => {
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const hydrated = useHasHydrated();

    if (!isOpen || !selectedElement) return null;

    // FIXED: Cast to React.ElementType<any> to prevent TypeScript from complaining 
    // about passing injected standard props (element, onUpdate, etc.)
    const ElementProperty = (selectedElement.type.includes('Node')
        ? polyglotNodeComponentMapping.getElementPropertiesComponent(selectedElement.type)
        : polyglotEdgeComponentMapping.getElementPropertiesComponent(selectedElement.type)) as React.ElementType<any>;

    // We create a generic change handler that works for both Nodes and Edges
    // so the child form components can just call `onChange('title', 'New Title')`
    const handleFieldChange = (field: string, value: any) => {
        if (onUpdateElement) {
            onUpdateElement({ ...selectedElement, [field]: value });
        }
    };

    return (
        <BasePanel isOpen={isOpen} onClose={onClose}>
            <div className={styles.header}>
                <h2 className={styles.heading}>Properties:</h2>
                <button
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="Close properties panel"
                >
                    ✕
                </button>
            </div>

            {isEditorOpen ? (
                <div className={styles.editorContainer}>
                    <button className={styles.toggleButton} onClick={() => setIsEditorOpen(false)}>
                        Return to Form
                    </button>

                    <Editor
                        options={{ readOnly: true, minimap: { enabled: false } }}
                        height="60vh"
                        language="json"
                        value={JSON.stringify(selectedElement, null, 4) ?? ''}
                    />
                </div>
            ) : (
                <div className={styles.formContainer}>

                    {hydrated && ElementProperty && (
                        <ElementProperty
                            // Pass standard injected props
                            element={selectedElement}
                            onUpdateElement={onUpdateElement}

                            // Also pass the flattened props we refactored earlier (like EdgeProperties expects)
                            title={selectedElement.title}
                            type={selectedElement.type}
                            onChange={handleFieldChange}
                        />
                    )}

                    {children}

                    <button className={styles.toggleButton} onClick={() => setIsEditorOpen(true)}>
                        View Code
                    </button>
                </div>
            )}
        </BasePanel>
    );
};

export default ElementProperties;