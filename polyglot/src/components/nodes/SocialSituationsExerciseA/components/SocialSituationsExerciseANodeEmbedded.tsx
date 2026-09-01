'use client';

import { SocialSituationsExerciseACoreForm } from '@/components/nodes/SocialSituationsExerciseA/components/SocialSituationsExerciseACoreForm';
import { SocialSituationsExerciseAItem } from '@/components/nodes/SocialSituationsExerciseA/types';

export type SocialSituationsExerciseAData = {
    items: SocialSituationsExerciseAItem[];
};

type Props = {
    data: SocialSituationsExerciseAData;
    onDataChange: (newData: SocialSituationsExerciseAData) => void;
    isDisabled?: boolean;
};

const SocialSituationsExerciseANodeEmbedded = ({ data, onDataChange, isDisabled }: Props) => {
    return (
        <SocialSituationsExerciseACoreForm
            items={data?.items || []}
            onChange={(newItems) => onDataChange({ ...data, items: newItems })}
            isDisabled={isDisabled}
        />
    );
};

export default SocialSituationsExerciseANodeEmbedded;