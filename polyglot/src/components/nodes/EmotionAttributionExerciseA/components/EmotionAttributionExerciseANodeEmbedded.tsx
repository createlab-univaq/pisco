'use client';

import { EmotionAttributionExerciseACoreForm } from '@/components/nodes/EmotionAttributionExerciseA/components/EmotionAttributionExerciseACoreForm';
import { EmotionAttributionExerciseAData } from '../types';

type Props = {
    data: EmotionAttributionExerciseAData;
    onDataChange: (newData: EmotionAttributionExerciseAData) => void;
    isDisabled?: boolean;
};

const EmotionAttributionExerciseAEmbedded = ({ data, onDataChange, isDisabled }: Props) => {
    return (
        <EmotionAttributionExerciseACoreForm
            data={data}
            onChange={onDataChange}
            isDisabled={isDisabled}
        />
    );
};

export default EmotionAttributionExerciseAEmbedded;