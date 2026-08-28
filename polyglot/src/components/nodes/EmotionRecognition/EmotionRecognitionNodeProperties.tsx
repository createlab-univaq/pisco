'use client';

import { PolyglotNodePropertiesProps } from '@/types/ElementMappingTypes';
import NodeProperties from '../NodeProperties';
import { EmotionRecognitionNode } from './types';
import styles from './EmotionRecognitionNodeProperties.module.css';
import { EmotionRecognitionCoreForm } from './components/EmotionRecognitionCoreForm';
import { useNodeSync } from '@/hooks/useNodeSync';
import { validateEmotionRecognitionNode } from './validate';

const EmotionRecognitionNodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    const node = element as EmotionRecognitionNode;
    const data = node.data || {};
    const parentNodeId = node._id;

    const { handleBaseChange, handleDataChange } = useNodeSync(node, onUpdateElement);

    const validationErrors = validateEmotionRecognitionNode(data);

    return (
        <div className={styles.container}>
            <NodeProperties
                title={node.title}
                description={node.description}
                onUpdateTitle={(val) => handleBaseChange({ title: val })}
                onUpdateDescription={(val) => handleBaseChange({ description: val })}
                activityDescription="Riconoscimento delle emozioni: osserva un'immagine e seleziona l'emozione corretta."
            />

            <hr className={styles.divider} />

            {validationErrors.length > 0 && (
                <div style={{ padding: '0 0.5rem', marginBottom: '0.5rem', color: '#e53e3e', fontSize: '0.875rem' }}>
                    <strong>Validation Errors:</strong>
                    <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                        {validationErrors.map((err, idx) => (
                            <li key={idx}>[{err.path}]: {err.message}</li>
                        ))}
                    </ul>
                </div>
            )}

            <EmotionRecognitionCoreForm
                data={data}
                onChange={handleDataChange}
                parentNodeId={parentNodeId}
            />
        </div>
    );
};

export default EmotionRecognitionNodeProperties;