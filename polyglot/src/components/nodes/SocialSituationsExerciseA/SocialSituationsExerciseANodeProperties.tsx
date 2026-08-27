'use client';

import { PolyglotNodePropertiesProps } from '@/types/polyglot-elements/ElementMappingTypes';
import NodeProperties from '../NodeProperties';
import styles from './SocialSituationsExerciseANodeProperties.module.css';
import { SocialSituationsExerciseANode } from './types';
import SocialSituationsExerciseANodeEmbedded, { SocialSituationsExerciseAData } from '@/components/embedded/SocialSituationsExerciseANodeEmbedded/SocialSituationsExerciseANodeEmbedded';
import { useNodeSync } from '@/hooks/useNodeSync';

const SocialSituationsExerciseANodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    const node = element as SocialSituationsExerciseANode;
    const data = node.data || {};

    const { handleBaseChange, handleDataChange } = useNodeSync(node, onUpdateElement);

    return (
        <div className={styles.container}>
            <NodeProperties
                
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