'use client';

import styles from './EmotionAttributionExerciseANodeProperties.module.css';
import { PolyglotNodePropertiesProps } from '@/types/ElementMappingTypes';
import NodeProperties from '../NodeProperties';
import { EmotionAttributionExerciseACoreForm } from './components/EmotionAttributionExerciseACoreForm';
import { useNodeSync } from '@/hooks/useNodeSync';

const EmotionAttributionExerciseANodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    const node = element as any;
    const data = node.data || {};

    const { handleBaseChange, handleDataChange } = useNodeSync(node, onUpdateElement);

    return (
        <div className={styles.container}>
            <NodeProperties
                activityDescription="Esercitazione di attribuzione delle emozioni (Tipo A): inserisci uno scenario, una domanda e le risposte corrette con le relative spiegazioni."
                title={node.title}
                description={node.description}
                onUpdateTitle={(val) => handleBaseChange({ title: val })}
                onUpdateDescription={(val) => handleBaseChange({ description: val })}
            />

            <hr className={styles.divider} />

            <EmotionAttributionExerciseACoreForm
                data={data}
                onChange={handleDataChange}
            />
        </div>
    );
};

export default EmotionAttributionExerciseANodeProperties;