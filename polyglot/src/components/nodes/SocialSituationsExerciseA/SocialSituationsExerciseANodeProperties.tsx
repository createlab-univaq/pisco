'use client';

import styles from './SocialSituationsExerciseANodeProperties.module.css';
import { PolyglotNodePropertiesProps } from '@/types/ElementMappingTypes';
import { SocialSituationsExerciseANode } from './types';
import NodeProperties from '../NodeProperties';
import { useNodeSync } from '@/hooks/useNodeSync';
import { SocialSituationsExerciseACoreForm } from './components/SocialSituationsExerciseACoreForm';

const SocialSituationsExerciseANodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    const node = element as SocialSituationsExerciseANode;
    const data = node.data || {};
    const items = data.items || [];

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

            <SocialSituationsExerciseACoreForm
                items={items}
                onChange={(newItems) => handleDataChange({ items: newItems })}
            />
        </div>
    );
};

export default SocialSituationsExerciseANodeProperties;