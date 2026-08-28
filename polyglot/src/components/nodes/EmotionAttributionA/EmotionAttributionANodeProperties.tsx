'use client';

import styles from './EmotionAttributionANodeProperties.module.css';
import { PolyglotNodePropertiesProps } from '@/types/polyglot-elements/ElementMappingTypes';
import NodeProperties from '../NodeProperties';
import EmotionAttributionAEmbedded from './components/EmotionAttributionAEmbedded';
import { useNodeSync } from '@/hooks/useNodeSync';

const EmotionAttributionANodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    const node = element as any;
    const data = node.data;

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

            <div className={styles.hintBox}>
                <p className={styles.hintText}>
                    Suggerimento: usa <b>Scenario</b> per descrivere la situazione e{' '}
                    <b>Domanda</b> per chiedere quale emozione/interpretazione è corretta.
                    Inserisci poi una o più <b>risposte corrette</b>.
                </p>
            </div>

            <hr className={styles.divider} />

            <EmotionAttributionAEmbedded
                data={data}
                onChange={handleDataChange}
            />
        </div>
    );
};

export default EmotionAttributionANodeProperties;