'use client';

import { EmotionRecognitionCoreForm, EmotionRecognitionData } from '@/components/nodes/EmotionRecognition/components/EmotionRecognitionCoreForm';

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
    return (
        <EmotionRecognitionCoreForm
            data={data}
            onChange={onDataChange}
            parentNodeId={parentNodeId}
            parentItemId={parentItemId}
            isDisabled={isDisabled}
        />
    );
};

export default EmotionRecognitionNodeEmbedded;