'use client';

import styles from './FauxPasExerciseANodeProperties.module.css';
import { PolyglotNodePropertiesProps } from '@/types/ElementMappingTypes';
import { FauxPasExerciseANode } from './types';
import NodeProperties from '../NodeProperties';
import { useNodeSync } from '@/hooks/useNodeSync';
import { FauxPasExerciseACoreForm } from './components/FauxPasExerciseACoreForm';

const FauxPasExerciseANodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    const node = element as FauxPasExerciseANode;
    const data = node.data || {};

    const { handleBaseChange, handleDataChange } = useNodeSync(node, onUpdateElement);

    return (
        <div className={styles.container}>
            <NodeProperties
                title={node.title}
                description={node.description}
                onUpdateTitle={(val) => handleBaseChange({ title: val })}
                onUpdateDescription={(val) => handleBaseChange({ description: val })}
            />

            <hr className={styles.divider} />

            <FauxPasExerciseACoreForm
                data={data}
                onChange={handleDataChange}
            />
        </div>
    );
};

export default FauxPasExerciseANodeProperties;