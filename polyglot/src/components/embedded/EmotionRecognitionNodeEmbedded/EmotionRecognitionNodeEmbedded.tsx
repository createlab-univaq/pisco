'use client';

import QuestionImageUploadField from '@/components/forms/QuestionImageUploadField';
import SingleSelectAnswersField from '@/components/forms/SingleSelectAnswersField';
import styles from './EmotionRecognitionNodeEmbedded.module.css';

export type EmotionRecognitionData = {
    imageId?: string;
    answers: string[];
    correctIndex: number;
};

type Props = {
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
}: Props) => {

    // Generic update handler
    const handleDataUpdate = (updates: Partial<EmotionRecognitionData>) => {
        onDataChange({ ...data, ...updates });
    };

    return (
        <div className={styles.container}>
            <p className={styles.title}>
                Riconoscimento emozioni
            </p>

            {/* Assumes QuestionImageUploadField is refactored to take imageId & onImageIdChange */}
            <QuestionImageUploadField
                parentNodeId={parentNodeId}
                parentItemId={parentItemId}
                imageId={data.imageId}
                onImageIdChange={(newId: string | undefined) => handleDataUpdate({ imageId: newId })}
                isDisabled={!!isDisabled || !parentNodeId}
            />

            <hr className={styles.divider} />

            {/* Matches the exact controlled API we built earlier for SingleSelectAnswersField */}
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