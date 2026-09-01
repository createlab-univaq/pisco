'use client';

import TextField from '@/components/forms/TextField';
import StringArrayField from '@/components/forms/StringArrayField';
import styles from './EmotionAttributionExerciseACoreForm.module.css';
import { validateEmotionAttributionExerciseANode } from '../validate';
import { ValidationError } from '@/types/ValidationError';
import { EmotionAttributionExerciseAData } from '../types';

type Props = {
    data: EmotionAttributionExerciseAData;
    onChange: (newData: EmotionAttributionExerciseAData) => void;
    isDisabled?: boolean;
    getExternalErrors?: ValidationError[];
};

export const EmotionAttributionExerciseACoreForm = ({ data = {} as EmotionAttributionExerciseAData, onChange, isDisabled, getExternalErrors }: Props) => {
    const handleChange = (field: keyof EmotionAttributionExerciseAData, value: any) => {
        onChange({
            ...data,
            [field]: value,
        });
    };

    const localErrors = validateEmotionAttributionExerciseANode(data);
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
                    error={getFieldError('data.risposteCorrette')}
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