'use client';

import QuestionImageUploadField from '@/components/forms/QuestionImageUploadField';
import SingleSelectAnswersField from '@/components/forms/SingleSelectAnswersField';
import styles from './EmotionRecognitionCoreForm.module.css';
import { validateEmotionRecognitionNode } from '../validate';
import { ValidationError } from '@/types/ValidationError';

export type EmotionRecognitionData = {
    imageId?: string;
    answers: string[];
    correctIndex: number;
};

type Props = {
    data: EmotionRecognitionData;
    onChange: (newData: EmotionRecognitionData) => void;
    parentNodeId?: string;
    parentItemId?: string;
    isDisabled?: boolean;
    getExternalErrors?: ValidationError[];
};

export const EmotionRecognitionCoreForm = ({
    data,
    onChange,
    parentNodeId,
    parentItemId,
    isDisabled,
    getExternalErrors,
}: Props) => {
    const handleDataUpdate = (updates: Partial<EmotionRecognitionData>) => {
        onChange({ ...data, ...updates });
    };

    const localErrors = validateEmotionRecognitionNode(data);
    const activeErrors = getExternalErrors || localErrors;

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

            <p className={styles.title}>
                Riconoscimento Emozioni
            </p>

            <QuestionImageUploadField
                parentNodeId={parentNodeId}
                parentItemId={parentItemId}
                imageId={data.imageId}
                onImageIdChange={(newId: string | undefined) => handleDataUpdate({ imageId: newId })}
                isDisabled={!!isDisabled || !parentNodeId}
            />

            <hr className={styles.divider} />

            <SingleSelectAnswersField
                label="Seleziona la risposta corretta"
                answers={data.answers || ['', '']}
                correctIndex={data.correctIndex ?? 0}
                onAnswersChange={(newAnswers: string[]) => handleDataUpdate({ answers: newAnswers })}
                onCorrectIndexChange={(newIndex: number | null) => handleDataUpdate({ correctIndex: newIndex ?? 0 })}
                minAnswers={2}
                defaultAnswers={['', '']}
                allowNoCorrect={false}
                isDisabled={isDisabled}
            />
        </div>
    );
};