'use client';

import styles from './EmotionAttributionExerciseBNodeProperties.module.css';
import { PolyglotNodePropertiesProps } from '@/types/ElementMappingTypes';
import NodeProperties from '../NodeProperties';
import { useNodeSync } from '@/hooks/useNodeSync';
import { EmotionAttributionExerciseBCoreForm } from './components/EmotionAttributionExerciseBCoreForm';
import { EmotionAttributionExerciseBNode } from './types';

const EmotionAttributionExerciseBNodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    const node = element as EmotionAttributionExerciseBNode;
    const data = node.data || {};

    const { handleBaseChange, handleDataChange } = useNodeSync(node, onUpdateElement);

    return (
        <div className={styles.container}>
            <NodeProperties
                title={node.title}
                description={node.description}
                onUpdateTitle={(val) => handleBaseChange({ title: val })}
                onUpdateDescription={(val) => handleBaseChange({ description: val })}
            />
            <hr className={styles.divider} />

            <EmotionAttributionExerciseBCoreForm
                items={data.items || []}
                onChange={(newItems) => handleDataChange({ items: newItems })}
            />
        </div>
    );
};

export default EmotionAttributionExerciseBNodeProperties;