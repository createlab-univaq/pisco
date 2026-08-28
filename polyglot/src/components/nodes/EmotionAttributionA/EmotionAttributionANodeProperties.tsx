'use client';

import styles from './EmotionAttributionANodeProperties.module.css';
import { PolyglotNodePropertiesProps } from '@/types/ElementMappingTypes';
import NodeProperties from '../NodeProperties';
import { EmotionAttributionACoreForm } from './components/EmotionAttributionACoreForm';
import { useNodeSync } from '@/hooks/useNodeSync';
import { validateEmotionAttributionANode } from './validate';

const EmotionAttributionANodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    const node = element as any;
    const data = node.data || {};

    const { handleBaseChange, handleDataChange } = useNodeSync(node, onUpdateElement);

    const validationErrors = validateEmotionAttributionANode(data);

    return (
        <div className={styles.container}>
            <NodeProperties
                activityDescription="Esercitazione di attribuzione delle emozioni (Tipo A): inserisci uno scenario, una domanda e le risposte corrette con le relative spiegazioni."
                title={node.title}
                description={node.description}
                onUpdateTitle={(val) => handleBaseChange({ title: val })}
                onUpdateDescription={(val) => handleBaseChange({ description: val })}
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

            <EmotionAttributionACoreForm
                data={data}
                onChange={handleDataChange}
            />
        </div>
    );
};

export default EmotionAttributionANodeProperties;