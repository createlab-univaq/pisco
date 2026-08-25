'use client';

import styles from './EmotionAttributionBNodeProperties.module.css';
import { PolyglotNodePropertiesProps } from '@/components/ElementMapping';
import { EmotionAttributionBNode } from './types';
import NodeProperties from '../NodeProperties';
import EmotionAttributionBEmbedded from './EmotionAttributionBEmbedded';
import { useNodeSync } from '@/hooks/useNodeSync';

const EmotionAttributionBNodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    // 1. Cast the generic PolyglotNode to your specific EmotionAttributionBNode
    const node = element as EmotionAttributionBNode;
    const data = node.data;

    const { handleBaseChange, handleDataChange } = useNodeSync(node, onUpdateElement);

    return (
        <div className={styles.container}>
            <NodeProperties
                platform={['WebApp']}
                activityDescription="Esercitazione di attribuzione delle emozioni (Tipo B): inserisci una lista di elementi, ciascuno con emozione, scenario e spiegazione dello scenario."
                title={node.title}
                description={node.description}
                onUpdateTitle={(val) => handleBaseChange({ title: val })}
                onUpdateDescription={(val) => handleBaseChange({ description: val })}
            />

            <div className={styles.embeddedContainer}>
                {/* 
                    The child component no longer relies on react-hook-form's 'basePath'.
                    It now receives its state directly and reports changes back up.
                */}
                <EmotionAttributionBEmbedded
                    data={data}
                    onChange={handleDataChange}
                />
            </div>
        </div>
    );
};

export default EmotionAttributionBNodeProperties;