'use client';

import styles from './EmotionAttributionBNodeProperties.module.css';
import { PolyglotNodePropertiesProps } from '@/types/ElementMappingTypes';
import NodeProperties from '../NodeProperties';
import { useNodeSync } from '@/hooks/useNodeSync';
import { EmotionAttributionBCoreForm } from './components/EmotionAttributionBCoreForm';
import { EmotionAttributionBNode } from './types';
import { validateEmotionAttributionBNode } from './validate';

const EmotionAttributionBNodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    const node = element as EmotionAttributionBNode;
    const data = node.data || {};

    const { handleBaseChange, handleDataChange } = useNodeSync(node, onUpdateElement);

    const validationErrors = validateEmotionAttributionBNode(data);

    return (
        <div className={styles.container}>
            <NodeProperties
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

            <EmotionAttributionBCoreForm
                items={data.items || []}
                onChange={(newItems) => handleDataChange({ items: newItems })}
            />
        </div>
    );
};

export default EmotionAttributionBNodeProperties;