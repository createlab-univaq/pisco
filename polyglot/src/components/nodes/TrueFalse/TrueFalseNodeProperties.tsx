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
                activityDescription="In this activity learners will have to provide answers to true and false questions"
                title={node.title}
                description={node.description}
                onUpdateTitle={(val) => handleBaseChange({ title: val })}
                onUpdateDescription={(val) => handleBaseChange({ description: val })}
            />

            <hr className={styles.divider} />

            {validationErrors.length > 0 && (
                <div style={{ padding: '0 0.5rem', marginBottom: '0.5rem', color: '#e53e3e', fontSize: '0.875rem' }}>
                    <strong>Validation Errors:</strong>
                    <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                        {validationErrors.map((err, idx) => (
                            <li key={idx}>[{err.path}]: {err.message}</li>
                        ))}
                    </ul>
                </div>
            )}

            <TextField
                name="instructions"
                label="Instructions"
                value={data?.instructions || ''}
                onChange={(e) => handleDataChange({ instructions: e.target.value })}
                isTextArea
                error={getFieldError('data.instructions')}
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