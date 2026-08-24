'use client';

import TextField from '@/components/forms/TextField';
import styles from './SocialSituationsExerciseANodeEmbedded.module.css';
import AnswerExplanationListField from '@/components/forms/AnswerExplanationListField';

export type SocialSituationsExerciseAItem = {
    answer: string;
    explanation: string;
};

export type SocialSituationsExerciseAData = {
    scenario: string;
    items: SocialSituationsExerciseAItem[];
    correctIndex: number;
};

type Props = {
    data: SocialSituationsExerciseAData;
    onDataChange: (newData: SocialSituationsExerciseAData) => void;
    isDisabled?: boolean;
};

const SocialSituationsExerciseANodeEmbedded = ({
    data,
    onDataChange,
    isDisabled,
}: Props) => {
    const handleDataUpdate = (updates: Partial<SocialSituationsExerciseAData>) => {
        onDataChange({ ...data, ...updates });
    };

    return (
        <div className={styles.container}>
            <TextField
                label="Scenario"
                name="scenario"
                value={data.scenario || ''}
                onChange={(e) => handleDataUpdate({ scenario: e.target.value })}
                isTextArea
                isDisabled={isDisabled}
            />

            <AnswerExplanationListField
                label="Risposte (con spiegazione)"
                items={data.items || []}
                correctIndex={data.correctIndex ?? 0}
                onItemsChange={(newItems: SocialSituationsExerciseAItem[]) => handleDataUpdate({ items: newItems })}
                onCorrectIndexChange={(newIndex: number) => handleDataUpdate({ correctIndex: newIndex })}
                isDisabled={isDisabled}
            />
        </div>
    );
};

export default SocialSituationsExerciseANodeEmbedded;