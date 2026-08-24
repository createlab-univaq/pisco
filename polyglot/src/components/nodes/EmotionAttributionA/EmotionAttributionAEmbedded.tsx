'use client';

import StringArrayField from '@/components/forms/StringArrayField';
import styles from './EmotionAttributionAEmbedded.module.css';
import TextField from '@/components/forms/TextField';

// Define the shape of the data this embedded form manages
export type EmotionAttributionAData = {
    scenario?: string;
    domanda?: string;
    risposteCorrette?: string[];
    spiegazioneS?: string;
    spiegazioneR?: string;
};

type Props = {
    data: EmotionAttributionAData;
    onChange: (updatedData: Partial<EmotionAttributionAData>) => void;
    isDisabled?: boolean;
};

const EmotionAttributionAEmbedded = ({ data, onChange, isDisabled }: Props) => {
    return (
        <div className={styles.container}>
            <TextField
                label="Scenario"
                name="scenario"
                value={data.scenario || ''}
                onChange={(e) => onChange({ scenario: e.target.value })}
                isTextArea
                isDisabled={isDisabled}
            />

            <TextField
                label="Domanda"
                name="domanda"
                value={data.domanda || ''}
                onChange={(e) => onChange({ domanda: e.target.value })}
                isTextArea
                isDisabled={isDisabled}
            />

            <h4 className={styles.heading}>
                Risposte corrette (lista)
            </h4>

            {/* 
                Assuming StringArrayField was refactored to take 'values' and 'onChange'
                instead of relying on react-hook-form's 'name' prop.
            */}
            <StringArrayField
                values={data.risposteCorrette || []}
                onChange={(updatedArray) => onChange({ risposteCorrette: updatedArray })}
                itemLabel="Risposta corretta"
                addLabel="Aggiungi risposta corretta"
                defaultItemValue=""
                keepAtLeastOne
                isDisabled={isDisabled}
            />

            <hr className={styles.divider} />

            <TextField
                label="Spiegazione (Scenario)"
                name="spiegazioneS"
                value={data.spiegazioneS || ''}
                onChange={(e) => onChange({ spiegazioneS: e.target.value })}
                isTextArea
                isDisabled={isDisabled}
            />

            <TextField
                label="Spiegazione (Risposta)"
                name="spiegazioneR"
                value={data.spiegazioneR || ''}
                onChange={(e) => onChange({ spiegazioneR: e.target.value })}
                isTextArea
                isDisabled={isDisabled}
            />
        </div>
    );
};

export default EmotionAttributionAEmbedded;