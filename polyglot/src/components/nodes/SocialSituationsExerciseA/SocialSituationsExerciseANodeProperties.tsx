'use client';

import { PolyglotNodePropertiesProps } from '@/components/ElementMapping';
import NodeProperties from '../NodeProperties';
import styles from './SocialSituationsExerciseANodeProperties.module.css';
import { SocialSituationsExerciseANode } from './types';
import SocialSituationsExerciseANodeEmbedded, { SocialSituationsExerciseAData } from '@/components/embedded/SocialSituationsExerciseANodeEmbedded/SocialSituationsExerciseANodeEmbedded';

const SocialSituationsExerciseANodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    const node = element as SocialSituationsExerciseANode;
    const data = node.data || {};

    const handleBaseChange = (updatedBase: Partial<SocialSituationsExerciseANode>) => {
        onUpdateElement({ ...node, ...updatedBase });
    };

    // Fix: Type newData with the inner payload type, not the full node data type
    const handleDataChange = (newData: SocialSituationsExerciseAData) => {
        onUpdateElement({
            ...node,
            data: {
                ...node.data,
                ...newData, // Keeps nodeData safe while updating scenario, items, and correctIndex
            },
        });
    };

    return (
        <div className={styles.container}>
            <NodeProperties
                platform={['WebApp']}
                title={node.title}
                description={node.description}
                onUpdateTitle={(val) => handleBaseChange({ title: val })}
                onUpdateDescription={(val) => handleBaseChange({ description: val })}
                activityDescription="Esercitazione di situazione sociale (Tipo A): inserisci uno scenario e una lista di risposte con spiegazione. Imposta poi l'indice della risposta corretta."
            />

            <hr className={styles.divider} />

            <SocialSituationsExerciseANodeEmbedded
                data={data}
                onDataChange={handleDataChange}
            />
        </div>
    );
};

export default SocialSituationsExerciseANodeProperties;