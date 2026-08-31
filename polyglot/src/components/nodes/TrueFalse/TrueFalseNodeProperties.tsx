'use client';

import styles from './TrueFalseNodeProperties.module.css';
import TextField from '@/components/forms/TextField';
import { TrueFalseNode } from './types';
import { PolyglotNodePropertiesProps } from '@/types/ElementMappingTypes';
import NodeProperties from '../NodeProperties';
import TrueFalseArrayField from './components/TrueFalseArrayField';
import { useNodeSync } from '@/hooks/useNodeSync';
import { validateTrueFalseNode } from './validate';

const TrueFalseNodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    const node = element as TrueFalseNode;
    const data = node.data || {};

    const { handleBaseChange, handleDataChange } = useNodeSync(node, onUpdateElement);

    const validationErrors = validateTrueFalseNode(data);
    const getFieldError = (path: string) =>
        validationErrors.find((e) => e.path === path)?.message;

    return (
        <div className={styles.container}>
            <NodeProperties
                activityDescription="In this activity learners will have to provide answers to true and false questions."
                title={node.title}
                description={node.description}
                onUpdateTitle={(val) => handleBaseChange({ title: val })}
                onUpdateDescription={(val) => handleBaseChange({ description: val })}
            />

            <hr className={styles.divider} />

            {validationErrors.length > 0 && (
                <div className={styles.validationBox}>
                    <strong>Validation Errors:</strong>
                    <ul className={styles.validationList}>
                        {validationErrors.map((err, idx) => (
                            <li key={idx}>[{err.path}]: {err.message}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className={styles.formContainer}>
                <TextField
                    name="instructions"
                    label="Instructions"
                    value={data?.instructions || ''}
                    onChange={(e) => handleDataChange({ instructions: e.target.value })}
                    isTextArea
                    error={getFieldError('data.instructions')}
                />

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
                        error={getFieldError('data.questions') || getFieldError('data.isQuestionCorrect')}
                    />
                </div>
            </div>
        </div>
    );
};

export default TrueFalseNodeProperties;