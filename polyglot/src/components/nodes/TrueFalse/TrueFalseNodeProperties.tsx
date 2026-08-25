'use client';

import { useState } from 'react';
import styles from './TrueFalseNodeProperties.module.css';
import TextField from '@/components/forms/TextField';
import { TrueFalseNode } from './types';
import { PolyglotNodePropertiesProps } from '@/components/ElementMapping';
import NodeProperties from '../NodeProperties';
import TrueFalseArrayField from './TrueFalseArrayField';
import { useNodeSync } from '@/hooks/useNodeSync';

const TrueFalseNodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    const [isOpenAITool, setIsOpenAITool] = useState(false);
    const [generatingLoading, setGeneratingLoading] = useState(false);

    const node = element as TrueFalseNode;
    const data = node.data;

    // Golden standard: using the shared hook instead of rewriting sync logic
    const { handleBaseChange, handleDataChange } = useNodeSync(node, onUpdateElement);

    const handleOpenAITool = () => {
        setGeneratingLoading(true);
        setIsOpenAITool(true);
        setTimeout(() => setGeneratingLoading(false), 2000);
    };

    return (
        <div className={styles.container}>
            <NodeProperties
                
                activityDescription="In this activity learners will have to provide answers to true and false questions"
                title={node.title}
                description={node.description}
                onUpdateTitle={(val) => handleBaseChange({ title: val })}
                onUpdateDescription={(val) => handleBaseChange({ description: val })}
            />

            <TextField
                name="instructions"
                label="Instructions"
                value={data?.instructions || ''}
                onChange={(e) => handleDataChange({ instructions: e.target.value })}
                isTextArea
            />

            <div className={styles.pointsRow}>
                <TextField
                    name="positivePoints"
                    label="Positive Points"
                    value={data?.positivePoints?.toString() || '1'}
                    onChange={(e) => handleDataChange({ positivePoints: Number(e.target.value) })}
                />
                <TextField
                    name="negativePoints"
                    label="Negative Points"
                    value={data?.negativePoints?.toString() || '0'}
                    onChange={(e) => handleDataChange({ negativePoints: Number(e.target.value) })}
                />
            </div>

            <div className={styles.questionsContainer}>
                {generatingLoading ? (
                    <div className={styles.skeletonBox}>
                        <div className={styles.skeletonLine}></div>
                        <div className={styles.skeletonLine}></div>
                    </div>
                ) : (
                    <TrueFalseArrayField
                        label="Questions"
                        optionLabel="Question"
                        questions={data?.questions || []}
                        isCorrect={data?.isQuestionCorrect || []}
                        onChange={(updatedQuestions, updatedIsCorrect) => {
                            handleDataChange({
                                questions: updatedQuestions,
                                isQuestionCorrect: updatedIsCorrect,
                            });
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default TrueFalseNodeProperties;