'use client';

import QuestionImageUploadField from '@/components/forms/QuestionImageUploadField';
import SingleSelectAnswersField from '@/components/forms/SingleSelectAnswersField';
import TextField from '@/components/forms/TextField'; // <-- ADDED: Import TextField
import styles from './EmotionRecognitionExerciseACoreForm.module.css';
import { validateEmotionRecognitionExerciseANode } from '../validate';
import { ValidationError } from '@/types/ValidationError';

export type EmotionRecognitionExerciseAData = {
    imageId?: string;
    answers: string[];
    correctIndex: number;
    explanation?: string;
};

type Props = {
    data: EmotionRecognitionExerciseAData;
    onChange: (newData: EmotionRecognitionExerciseAData) => void;
    parentNodeId?: string;
    parentItemId?: string;
    isDisabled?: boolean;
    getExternalErrors?: ValidationError[];
};

export const EmotionRecognitionExerciseACoreForm = ({
    data,
    onChange,
    parentNodeId,
    parentItemId,
    isDisabled,
    getExternalErrors,
}: Props) => {
    const handleDataUpdate = (updates: Partial<EmotionRecognitionExerciseAData>) => {
        onChange({ ...data, ...updates });
    };

    const localErrors = validateEmotionRecognitionExerciseANode(data);
    const activeErrors = getExternalErrors || localErrors;

    const getFieldError = (path: string) =>
        activeErrors.find((e) => e.path === path)?.message;

    return (
        <div className={styles.container}>
            {activeErrors.length > 0 && !getExternalErrors && (
                <div style={{ padding: '0 0.5rem', color: '#e53e3e', fontSize: '0.875rem' }}>
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
                error={getFieldError('data.imageId')}
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
                error={getFieldError('data.answers') || getFieldError('data.correctIndex')}
            />

            <TextField
                label="Spiegazione risposta"
                name="explanation"
                value={data.explanation || ''}
                onChange={(e) => handleDataUpdate({ explanation: e.target.value })}
                isTextArea
                isDisabled={isDisabled}
                error={getFieldError('data.explanation')}
            />
        </div>
    );
};