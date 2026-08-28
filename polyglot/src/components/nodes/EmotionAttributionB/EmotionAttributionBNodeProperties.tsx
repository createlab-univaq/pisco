'use client';

import styles from './EmotionAttributionBNodeProperties.module.css';
import { PolyglotNodePropertiesProps } from '@/types/polyglot-elements/ElementMappingTypes';
import NodeProperties from '../NodeProperties';
import { useNodeSync } from '@/hooks/useNodeSync';
import { EmotionAttributionBCoreForm } from './components/EmotionAttributionBCoreForm';
import { EmotionAttributionBNode } from './types';

const EmotionAttributionBNodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {

    const node = element as EmotionAttributionBNode;

    const { handleBaseChange, handleDataChange } = useNodeSync(node, onUpdateElement);

    const data = node.data || {};

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