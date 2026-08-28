'use client';

import QuestionImageUploadField from '@/components/forms/QuestionImageUploadField';
import SingleSelectAnswersField from '@/components/forms/SingleSelectAnswersField';
import styles from './EmotionRecognitionNodeEmbedded.module.css';

export type EmotionRecognitionData = {
    imageId?: string;
    answers: string[];
    correctIndex: number;
};

type EmotionRecognitionNodeEmbeddedProps = {
    data: EmotionRecognitionData;
    onDataChange: (newData: EmotionRecognitionData) => void;
    parentNodeId?: string;
    parentItemId?: string;
    isDisabled?: boolean;
};

const EmotionRecognitionNodeEmbedded = ({
    data,
    onDataChange,
    parentNodeId,
    parentItemId,
    isDisabled,
}: EmotionRecognitionNodeEmbeddedProps) => {

    const handleDataUpdate = (updates: Partial<EmotionRecognitionData>) => {
        onDataChange({ ...data, ...updates });
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
            />
        </div>
    );
};

export default EmotionRecognitionNodeEmbedded;