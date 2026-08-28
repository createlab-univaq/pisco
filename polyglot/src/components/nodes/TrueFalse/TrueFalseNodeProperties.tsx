'use client';

import styles from './TrueFalseNodeProperties.module.css';
import TextField from '@/components/forms/TextField';
import { TrueFalseNode } from './types';
import { PolyglotNodePropertiesProps } from '@/types/polyglot-elements/ElementMappingTypes';
import NodeProperties from '../NodeProperties';
import TrueFalseArrayField from './components/TrueFalseArrayField';
import { useNodeSync } from '@/hooks/useNodeSync';

const TrueFalseNodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {

    const node = element as TrueFalseNode;
    const data = node.data;

    // Golden standard: using the shared hook instead of rewriting sync logic
    const { handleBaseChange, handleDataChange } = useNodeSync(node, onUpdateElement);

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
            </div>
        </div>
    );
};

export default TrueFalseNodeProperties;