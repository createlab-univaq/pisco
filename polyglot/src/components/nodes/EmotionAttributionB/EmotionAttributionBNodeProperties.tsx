'use client';

import styles from './EmotionAttributionBNodeProperties.module.css';
import { PolyglotNodePropertiesProps } from '@/types/ElementMappingTypes';
import NodeProperties from '../NodeProperties';
import { useNodeSync } from '@/hooks/useNodeSync';
import { EmotionAttributionBCoreForm } from './components/EmotionAttributionBCoreForm';
import { EmotionAttributionBNode } from './types';

const EmotionAttributionBNodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    const node = element as EmotionAttributionBNode;
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

            <EmotionAttributionBCoreForm
                items={data.items || []}
                onChange={(newItems) => handleDataChange({ items: newItems })}
            />
        </div>
    );
};

export default EmotionAttributionBNodeProperties;