'use client';

import styles from './TheoryOfMindExerciseANodeProperties.module.css';
import { PolyglotNodePropertiesProps } from '@/types/ElementMappingTypes';
import NodeProperties from '../NodeProperties';
import { TheoryOfMindExerciseANode } from './types';
import { useNodeSync } from '@/hooks/useNodeSync';
import { TheoryOfMindExerciseACoreForm } from './components/TheoryOfMindExerciseACoreForm';

const TheoryOfMindExerciseANodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    const node = element as TheoryOfMindExerciseANode;
    const data = node.data || {};

    // We keep _id to pass down to the core form so image uploads attach correctly
    const nodeId = node._id;

    const { handleBaseChange, handleDataChange } = useNodeSync(node, onUpdateElement);

    return (
        <div className={styles.container}>
            <NodeProperties
                activityDescription="Crea elementi visivi con didascalia ed esattamente 2 quesiti a risposta Sì/No con spiegazione."
                title={node.title}
                description={node.description}
                onUpdateTitle={(val) => handleBaseChange({ title: val })}
                onUpdateDescription={(val) => handleBaseChange({ description: val })}
            />

            <hr className={styles.divider} />

            <TheoryOfMindExerciseACoreForm
                data={data}
                nodeId={nodeId}
                onChange={handleDataChange}
            />
        </div>
    );
};

export default TheoryOfMindExerciseANodeProperties;