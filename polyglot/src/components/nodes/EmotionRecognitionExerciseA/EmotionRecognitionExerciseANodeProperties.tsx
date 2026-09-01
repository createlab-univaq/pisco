'use client';

import { PolyglotNodePropertiesProps } from '@/types/ElementMappingTypes';
import NodeProperties from '../NodeProperties';
import { EmotionRecognitionExerciseANode } from './types';
import styles from './EmotionRecognitionExerciseANodeProperties.module.css';
import { EmotionRecognitionExerciseACoreForm } from './components/EmotionRecognitionExerciseACoreForm';
import { useNodeSync } from '@/hooks/useNodeSync';

const EmotionRecognitionExerciseANodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    const node = element as EmotionRecognitionExerciseANode;
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

            <EmotionRecognitionExerciseACoreForm
                data={data}
                onChange={handleDataChange}
                parentNodeId={parentNodeId}
            />
        </div>
    );
};

export default EmotionRecognitionExerciseANodeProperties;