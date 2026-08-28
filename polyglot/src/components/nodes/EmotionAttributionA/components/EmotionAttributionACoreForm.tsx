'use client';

import TextField from '@/components/forms/TextField';
import StringArrayField from '@/components/forms/StringArrayField';
import styles from './EmotionAttributionACoreForm.module.css';

export type EmotionAttributionAData = {
    scenario: string;
    domanda: string;
    risposteCorrette: string[];
    spiegazioneS: string;
    spiegazioneR: string;
};

type Props = {
    data: EmotionAttributionAData;
    onChange: (newData: EmotionAttributionAData) => void;
    isDisabled?: boolean;
};

export const EmotionAttributionACoreForm = ({ data = {} as EmotionAttributionAData, onChange, isDisabled }: Props) => {
    const handleChange = (field: keyof EmotionAttributionAData, value: any) => {
        onChange({
            ...data,
            [field]: value,
        });
    };

    return (
        <div className={styles.container}>
            <TextField
                label="Scenario"
                name="scenario"
                value={data.scenario || ''}
                onChange={(e) => handleChange('scenario', e.target.value)}
                isTextArea
                isDisabled={isDisabled}
            />

            <TextField
                label="Domanda"
                name="domanda"
                value={data.domanda || ''}
                onChange={(e) => handleChange('domanda', e.target.value)}
                isTextArea
                isDisabled={isDisabled}
            />

            <div className={styles.section}>
                <h4 className={styles.heading}>Risposte corrette (lista)</h4>
                <StringArrayField
                    values={data.risposteCorrette || []}
                    onChange={(newValues: string[]) => handleChange('risposteCorrette', newValues)}
                    itemLabel="Risposta corretta"
                    addLabel="Aggiungi risposta corretta"
                    defaultItemValue=""
                    keepAtLeastOne
                    isDisabled={isDisabled}
                />
            </div>

            <hr className={styles.divider} />

            <TextField
                label="Spiegazione (Scenario)"
                name="spiegazioneS"
                value={data.spiegazioneS || ''}
                onChange={(e) => handleChange('spiegazioneS', e.target.value)}
                isTextArea
                isDisabled={isDisabled}
            />

            <TextField
                label="Spiegazione (Risposta)"
                name="spiegazioneR"
                value={data.spiegazioneR || ''}
                onChange={(e) => handleChange('spiegazioneR', e.target.value)}
                isTextArea
                isDisabled={isDisabled}
            />
        </div>
    );
};