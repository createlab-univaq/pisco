'use client';

import { PolyglotNodePropertiesProps } from '@/types/polyglot-elements/ElementMappingTypes';
import NodeProperties from '../NodeProperties';
import { EmotionRecognitionNode } from './types';
import styles from './EmotionRecognitionNodeProperties.module.css';
import EmotionRecognitionNodeEmbedded, { EmotionRecognitionData } from '@/components/embedded/EmotionRecognitionNodeEmbedded/EmotionRecognitionNodeEmbedded';
import { useNodeSync } from '@/hooks/useNodeSync';

const EmotionRecognitionNodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    const node = element as EmotionRecognitionNode;
    const data = node.data || {};
    const parentNodeId = node._id;

    const { handleBaseChange, handleDataChange } = useNodeSync(node, onUpdateElement);

    return (
        <div className={styles.container}>
            <NodeProperties
                title={node.title}
                description={node.description}
                onUpdateTitle={(val) => handleBaseChange({ title: val })}
                onUpdateDescription={(val) => handleBaseChange({ description: val })}
                activityDescription="Riconoscimento delle emozioni: osserva un'immagine e seleziona l'emozione corretta."
            />

            <div className={styles.hintContainer}>
                <p className={styles.hintText}>
                    Suggerimento: carica un’immagine e inserisci le emozioni come possibili risposte, poi seleziona quella corretta.
                </p>
            </div>

            <hr className={styles.divider} />

            <EmotionRecognitionNodeEmbedded
                data={data}
                onDataChange={handleDataChange}
                parentNodeId={parentNodeId}
            />
        </div>
    );
};

export default EmotionRecognitionNodeProperties;