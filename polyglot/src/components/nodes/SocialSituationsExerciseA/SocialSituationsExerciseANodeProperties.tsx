'use client';

import styles from './SocialSituationsExerciseANodeProperties.module.css';
import { PolyglotNodePropertiesProps } from '@/types/ElementMappingTypes';
import { SocialSituationsExerciseANode } from './types';
import NodeProperties from '../NodeProperties';
import { useNodeSync } from '@/hooks/useNodeSync';
import { SocialSituationsExerciseACoreForm } from './components/SocialSituationsExerciseACoreForm';
import { validateSocialSituationsExerciseANode } from './validate';

const SocialSituationsExerciseANodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    const node = element as SocialSituationsExerciseANode;
    const data = node.data || {};
    const items = data.items || [];

    const { handleBaseChange, handleDataChange } = useNodeSync(node, onUpdateElement);

    const validationErrors = validateSocialSituationsExerciseANode(data);

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

            <SocialSituationsExerciseACoreForm
                items={items}
                onChange={(newItems) => handleDataChange({ items: newItems })}
            />
        </div>
    );
};

export default SocialSituationsExerciseANodeProperties;