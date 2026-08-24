'use client';

import styles from './EmotionAttributionANodeProperties.module.css';
import { PolyglotNodePropertiesProps } from '@/components/ElementMapping';
import NodeProperties from '../NodeProperties';
import EmotionAttributionAEmbedded from './EmotionAttributionAEmbedded';

// NOTE: Import your specific node type here once it is defined in your types.ts file
// import { EmotionAttributionANode } from './types'; 

const EmotionAttributionANodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    // 1. Cast the generic PolyglotNode to your specific Node type
    // Replace 'any' with 'EmotionAttributionANode' once your type file is created
    const node = element as any;
    const data = node.data;

    // 2. Helper to cleanly update the "base" portion of the node (title, description)
    const handleBaseChange = (updatedBase: Partial<typeof node>) => {
        onUpdateElement({
            ...node,
            ...updatedBase,
        });
    };

    // 3. Helper to cleanly update the "data" portion
    const handleDataChange = (updatedData: Partial<typeof data>) => {
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
                activityDescription="Esercitazione di attribuzione delle emozioni (Tipo A): inserisci uno scenario, una domanda e le risposte corrette con le relative spiegazioni."
                title={node.title}
                description={node.description}
                onUpdateTitle={(val) => handleBaseChange({ title: val })}
                onUpdateDescription={(val) => handleBaseChange({ description: val })}
            />

            <div className={styles.hintBox}>
                <p className={styles.hintText}>
                    Suggerimento: usa <b>Scenario</b> per descrivere la situazione e{' '}
                    <b>Domanda</b> per chiedere quale emozione/interpretazione è corretta.
                    Inserisci poi una o più <b>risposte corrette</b>.
                </p>
            </div>

            <hr className={styles.divider} />

            {/* 
                Since you no longer use react-hook-form or a global store, 
                you must pass the 'data' and the 'onChange' handler down 
                to your embedded component so it can update the node's state.
            */}
            <EmotionAttributionAEmbedded
                data={data}
                onChange={handleDataChange}
            />
        </div>
    );
};

export default EmotionAttributionANodeProperties;