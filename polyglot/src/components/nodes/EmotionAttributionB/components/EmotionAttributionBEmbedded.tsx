'use client';

import { EmotionAttributionBCoreForm } from '@/components/nodes/EmotionAttributionB/components/EmotionAttributionBCoreForm';
import { EmotionAttributionBItem } from '@/components/nodes/EmotionAttributionB/types';

export type EmotionAttributionBData = {
    items: EmotionAttributionBItem[];
};

type Props = {
    data: EmotionAttributionBData;
    onDataChange: (newData: EmotionAttributionBData) => void;
    isDisabled?: boolean;
};

const EmotionAttributionBEmbedded = ({ data, onDataChange, isDisabled }: Props) => {
    return (
        <EmotionAttributionBCoreForm
            items={data?.items || []}
            onChange={(newItems) => onDataChange({ ...data, items: newItems })}
            isDisabled={isDisabled}
        />
    );
};

export default EmotionAttributionBEmbedded;