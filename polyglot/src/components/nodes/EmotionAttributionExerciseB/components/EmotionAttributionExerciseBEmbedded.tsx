'use client';

import { EmotionAttributionExerciseBCoreForm } from '@/components/nodes/EmotionAttributionExerciseB/components/EmotionAttributionExerciseBCoreForm';
import { EmotionAttributionExerciseBItem } from '@/components/nodes/EmotionAttributionExerciseB/types';

export type EmotionAttributionExerciseBData = {
    items: EmotionAttributionExerciseBItem[];
};

type Props = {
    data: EmotionAttributionExerciseBData;
    onDataChange: (newData: EmotionAttributionExerciseBData) => void;
    isDisabled?: boolean;
};

const EmotionAttributionExerciseBEmbedded = ({ data, onDataChange, isDisabled }: Props) => {
    return (
        <EmotionAttributionExerciseBCoreForm
            items={data?.items || []}
            onChange={(newItems) => onDataChange({ ...data, items: newItems })}
            isDisabled={isDisabled}
        />
    );
};

export default EmotionAttributionExerciseBEmbedded;