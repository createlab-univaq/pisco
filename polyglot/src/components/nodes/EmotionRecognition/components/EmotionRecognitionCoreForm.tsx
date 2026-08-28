'use client';

import QuestionImageUploadField from '@/components/forms/QuestionImageUploadField';
import SingleSelectAnswersField from '@/components/forms/SingleSelectAnswersField';
import styles from './EmotionRecognitionCoreForm.module.css';

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
};

export const EmotionRecognitionCoreForm = ({
    data,
    onChange,
    parentNodeId,
    parentItemId,
    isDisabled,
}: Props) => {
    const handleDataUpdate = (updates: Partial<EmotionRecognitionData>) => {
        onChange({ ...data, ...updates });
    };

    return (
        <div className={styles.container}>
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