'use client';

import { EmotionAttributionACoreForm, EmotionAttributionAData } from '@/components/nodes/EmotionAttributionA/components/EmotionAttributionACoreForm';

type Props = {
    data: EmotionAttributionAData;
    onDataChange: (newData: EmotionAttributionAData) => void;
    isDisabled?: boolean;
};

const EmotionAttributionAEmbedded = ({ data, onDataChange, isDisabled }: Props) => {
    return (
        <EmotionAttributionACoreForm
            data={data}
            onChange={onDataChange}
            isDisabled={isDisabled}
        />
    );
};

export default EmotionAttributionAEmbedded;