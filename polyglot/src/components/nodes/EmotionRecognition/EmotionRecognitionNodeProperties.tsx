'use client';

import { PolyglotNodePropertiesProps } from '@/types/ElementMappingTypes';
import NodeProperties from '../NodeProperties';
import { EmotionRecognitionNode } from './types';
import styles from './EmotionRecognitionNodeProperties.module.css';
import { EmotionRecognitionCoreForm } from './components/EmotionRecognitionCoreForm';
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

            <hr className={styles.divider} />

            <EmotionRecognitionCoreForm
                data={data}
                onChange={handleDataChange}
                parentNodeId={parentNodeId}
            />
        </div>
    );
};

export default EmotionRecognitionNodeProperties;