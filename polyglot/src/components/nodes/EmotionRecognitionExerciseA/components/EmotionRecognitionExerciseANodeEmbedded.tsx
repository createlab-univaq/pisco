'use client';

import { EmotionRecognitionExerciseACoreForm, EmotionRecognitionExerciseAData } from '@/components/nodes/EmotionRecognitionExerciseA/components/EmotionRecognitionExerciseACoreForm';

type EmotionRecognitionExerciseANodeEmbeddedProps = {
    data: EmotionRecognitionExerciseAData;
    onDataChange: (newData: EmotionRecognitionExerciseAData) => void;
    parentNodeId?: string;
    parentItemId?: string;
    isDisabled?: boolean;
};

const EmotionRecognitionExerciseANodeEmbedded = ({
    data,
    onDataChange,
    parentNodeId,
    parentItemId,
    isDisabled,
}: EmotionRecognitionExerciseANodeEmbeddedProps) => {
    return (
        <EmotionRecognitionExerciseACoreForm
            data={data}
            onChange={onDataChange}
            parentNodeId={parentNodeId}
            parentItemId={parentItemId}
            isDisabled={isDisabled}
        />
    );
};

export default EmotionRecognitionExerciseANodeEmbedded;