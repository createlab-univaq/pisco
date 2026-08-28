'use client';

import styles from './EmotionAttributionBNodeProperties.module.css';
import { PolyglotNodePropertiesProps } from '@/types/polyglot-elements/ElementMappingTypes';
import { EmotionAttributionBNode } from './types';
import NodeProperties from '../NodeProperties';
import EmotionAttributionBEmbedded from './components/EmotionAttributionBEmbedded';
import { useNodeSync } from '@/hooks/useNodeSync';

const EmotionAttributionBNodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    const node = element as EmotionAttributionBNode;
    const data = node.data;

    const { handleBaseChange, handleDataChange } = useNodeSync(node, onUpdateElement);

    return (
        <div className={styles.container}>
            <NodeProperties
                activityDescription="Esercitazione di attribuzione delle emozioni (Tipo B): inserisci una lista di elementi, ciascuno con emozione, scenario e spiegazione dello scenario."
                title={node.title}
                description={node.description}
                onUpdateTitle={(val) => handleBaseChange({ title: val })}
                onUpdateDescription={(val) => handleBaseChange({ description: val })}
            />

            <hr className={styles.divider} />

            <div className={styles.embeddedContainer}>
                <EmotionAttributionBEmbedded
                    data={data}
                    onChange={handleDataChange}
                />
            </div>
        </div>
    );
};

export default EmotionAttributionBNodeProperties;