'use client';

import TextField from '@/components/forms/TextField';
import SingleSelectAnswersField from '@/components/forms/SingleSelectAnswersField';
import styles from './QuestionEditor.module.css';
import { FauxPasQuestion, FauxPasSkipIf } from '../../FauxPas/types'; // Adjust path if needed
import { EditorCardWrapper } from '@/components/layouts/EditorCardWrapper';

export type QuestionEditorProps = {
    question: FauxPasQuestion;
    index: number;
    allQuestions: FauxPasQuestion[];
    onChange: (updated: FauxPasQuestion) => void;
    onRemove: () => void;
};

export const QuestionEditor = ({ question, index, allQuestions, onChange, onRemove }: QuestionEditorProps) => {
    const skipIf = question.skipIf || { enabled: false, questionIndex: null, answerIndex: null };
    const previousQuestions = allQuestions.slice(0, index);
    const selectedPreviousQuestion = skipIf.questionIndex !== null ? previousQuestions[skipIf.questionIndex] : null;

    const handleSkipIfChange = (field: keyof FauxPasSkipIf, value: any) => {
        onChange({
            ...question,
            skipIf: { ...skipIf, [field]: value }
        });
    };

    return (
        <EditorCardWrapper
            title={`Q${index + 1}`}
            onRemove={onRemove}
            removeLabel="Remove"
        >
            <TextField
                label="Question"
                name={`q-${index}-text`}
                value={question.question || ''}
                onChange={(e) => onChange({ ...question, question: e.target.value })}
            />

            <SingleSelectAnswersField
                label="Answers"
                answers={question.answers || ['Si', 'No']}
                correctIndex={question.correctIndex}
                onAnswersChange={(newAnswers) => onChange({ ...question, answers: newAnswers })}
                onCorrectIndexChange={(newIndex) => onChange({ ...question, correctIndex: newIndex })}
                minAnswers={2}
                defaultAnswers={['Si', 'No']}
                allowNoCorrect={true}
            />

            {index > 0 && (
                <div className={styles.skipLogicContainer}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={skipIf.enabled}
                            onChange={(e) => handleSkipIfChange('enabled', e.target.checked)}
                            className={styles.checkbox}
                        />
                        Skippa questa domanda in base a una risposta precedente
                    </label>

                    {skipIf.enabled && (
                        <div className={styles.skipSelects}>
                            <select
                                className={styles.select}
                                value={skipIf.questionIndex !== null ? skipIf.questionIndex : ''}
                                onChange={(e) => {
                                    const val = e.target.value === '' ? null : Number(e.target.value);
                                    // FIX: Update both properties simultaneously in one object payload
                                    onChange({
                                        ...question,
                                        skipIf: {
                                            ...skipIf,
                                            questionIndex: val,
                                            answerIndex: null
                                        }
                                    });
                                }}
                            >
                                <option value="">-- Seleziona Domanda precedente --</option>
                                {previousQuestions.map((prevQ: any, i: number) => (
                                    <option key={i} value={i}>
                                        Q{i + 1}: {prevQ.question || 'Senza testo'}
                                    </option>
                                ))}
                            </select>

                            <select
                                className={styles.select}
                                value={skipIf.answerIndex !== null ? skipIf.answerIndex : ''}
                                onChange={(e) => {
                                    const val = e.target.value === '' ? null : Number(e.target.value);
                                    handleSkipIfChange('answerIndex', val);
                                }}
                                disabled={skipIf.questionIndex === null}
                            >
                                <option value="">-- Risposta che fa skippare --</option>
                                {(selectedPreviousQuestion?.answers || []).map((ans: string, i: number) => (
                                    <option key={i} value={i}>
                                        {ans || `Risposta ${i + 1}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            )}
        </EditorCardWrapper>
    );
};