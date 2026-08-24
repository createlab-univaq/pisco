'use client';

import styles from './EmotionAttributionBNodeProperties.module.css';
import { PolyglotNodePropertiesProps } from '@/components/ElementMapping';
import { EmotionAttributionBNode } from './types';
import NodeProperties from '../NodeProperties';
import EmotionAttributionBEmbedded from './EmotionAttributionBEmbedded';

const EmotionAttributionBNodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    // 1. Cast the generic PolyglotNode to your specific EmotionAttributionBNode
    const node = element as EmotionAttributionBNode;
    const data = node.data;

    // 2. Helper to update the base node properties (title, description)
    const handleBaseChange = (updatedBase: Partial<EmotionAttributionBNode>) => {
        onUpdateElement({
            ...node,
            ...updatedBase,
        });
    };

    // 3. Helper to update the specific data portion of the node
    const handleDataChange = (updatedData: Partial<EmotionAttributionBNode['data']>) => {
        onUpdateElement({
            ...node,
            data: {
                ...node.data,
                ...updatedData,
            },
        });
    };

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