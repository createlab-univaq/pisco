'use client';

import Editor from '@monaco-editor/react';
import { useState } from 'react';
import styles from './ElementProperties.module.css';
import { PolyglotNode } from '@/types/polyglot-elements/PolyglotNode';
import { PolyglotEdge } from '@/types/polyglot-elements/PolyglotEdge';
import { polyglotEdgeComponentMapping, polyglotNodeComponentMapping } from '../ElementMapping';
import { useHasHydrated } from '@/utils/utils';

export type ElementPropertiesProps = {
    // We enforce that this component only mounts when an element is selected
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

    const ElementProperty = (selectedElement.type.includes('Node')
        ? polyglotNodeComponentMapping.getElementPropertiesComponent(selectedElement.type)
        : polyglotEdgeComponentMapping.getElementPropertiesComponent(selectedElement.type)) as React.ElementType<any>;

    const handleFieldChange = (field: string, value: any) => {
        if (onUpdateElement) {
            onUpdateElement({ ...selectedElement, [field]: value });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                {/* Dynamically show the title of the selected element */}
                <h2 className={styles.heading}>{selectedElement.title || 'Properties'}</h2>
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
                            element={selectedElement}
                            onUpdateElement={onUpdateElement}
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
        </div>
    );
};

export default ElementProperties;