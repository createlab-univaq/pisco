'use client';

import TextField from '@/components/forms/TextField';
import StringArrayField from '@/components/forms/StringArrayField';
import styles from './EmotionAttributionACoreForm.module.css';
import { validateEmotionAttributionANode } from '../validate';
import { ValidationError } from '@/types/ValidationError';

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
    getExternalErrors?: ValidationError[];
};

export const EmotionAttributionACoreForm = ({ data = {} as EmotionAttributionAData, onChange, isDisabled, getExternalErrors }: Props) => {
    const handleChange = (field: keyof EmotionAttributionAData, value: any) => {
        onChange({
            ...data,
            [field]: value,
        });
    };

    // Autonomous local validation fallback
    const localErrors = validateEmotionAttributionANode(data);
    const activeErrors = getExternalErrors || localErrors;

    const getFieldError = (localPath: string) => {
        const match = activeErrors.find((e) =>
            e.path && (e.path === localPath || e.path.endsWith('.' + localPath))
        );
        return match?.message;
    };

    return (
        <div className={styles.container}>
            {activeErrors.length > 0 && !getExternalErrors && (
                <div style={{ padding: '0 0.5rem', marginBottom: '0.5rem', color: '#e53e3e', fontSize: '0.875rem' }}>
                    <strong>Validation Errors:</strong>
                    <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                        {activeErrors.map((err, idx) => (
                            <li key={idx}>[{err.path}]: {err.message}</li>
                        ))}
                    </ul>
                </div>
            )}

            <TextField
                label="Scenario"
                name="scenario"
                value={data.scenario || ''}
                onChange={(e) => handleChange('scenario', e.target.value)}
                isTextArea
                isDisabled={isDisabled}
                error={getFieldError('data.scenario')}
            />

            <TextField
                label="Domanda"
                name="domanda"
                value={data.domanda || ''}
                onChange={(e) => handleChange('domanda', e.target.value)}
                isTextArea
                isDisabled={isDisabled}
                error={getFieldError('data.domanda')}
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
                error={getFieldError('data.spiegazioneS')}
            />

            <TextField
                label="Spiegazione (Risposta)"
                name="spiegazioneR"
                value={data.spiegazioneR || ''}
                onChange={(e) => handleChange('spiegazioneR', e.target.value)}
                isTextArea
                isDisabled={isDisabled}
                error={getFieldError('data.spiegazioneR')}
            />
        </div>
    );
};