'use client';

import TextField from '@/components/forms/TextField';
import SingleSelectAnswersField from '@/components/forms/SingleSelectAnswersField';
import styles from './QuestionEditor.module.css';
import { FauxPasQuestion, FauxPasSkipIf } from '../types';
import { EditorCardWrapper } from '@/components/layouts/EditorCardWrapper';

export type QuestionEditorProps = {
    question: FauxPasQuestion;
    index: number;
    storyIndex: number;
    allQuestions: FauxPasQuestion[];
    onChange: (updated: FauxPasQuestion) => void;
    onRemove: () => void;
    getFieldError: (path: string) => string | undefined;
};

export const QuestionEditor = ({ question, index, storyIndex, allQuestions, onChange, onRemove, getFieldError }: QuestionEditorProps) => {
    const skipIf = question.skipIf || { enabled: false, questionIndex: null, answerIndex: null };
    const previousQuestions = allQuestions.slice(0, index);
    const selectedPreviousQuestion = skipIf.questionIndex !== null ? previousQuestions[skipIf.questionIndex] : null;

    const handleSkipIfChange = (field: keyof FauxPasSkipIf, value: any) => {
        onChange({
            ...question,
            skipIf: { ...skipIf, [field]: value }
        });
    };

    const questionError = getFieldError(`data.quiz.${storyIndex}.questions.${index}.question`);
    const answersError = getFieldError(`data.quiz.${storyIndex}.questions.${index}.answers`);
    const correctIndexError = getFieldError(`data.quiz.${storyIndex}.questions.${index}.correctIndex`);
    const skipIfError = getFieldError(`data.quiz.${storyIndex}.questions.${index}.skipIf`);
    const skipIfQuestionError = getFieldError(`data.quiz.${storyIndex}.questions.${index}.skipIf.questionIndex`);
    const skipIfAnswerError = getFieldError(`data.quiz.${storyIndex}.questions.${index}.skipIf.answerIndex`);

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
                error={questionError}
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
                error={answersError || correctIndexError}
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

                    {skipIfError && <span className={styles.errorText}>{skipIfError}</span>}

                    {skipIf.enabled && (
                        <div className={styles.skipSelects}>
                            <select
                                className={`${styles.select} ${skipIfQuestionError ? styles.selectInvalid : ''}`}
                                value={skipIf.questionIndex !== null ? skipIf.questionIndex : ''}
                                onChange={(e) => {
                                    const val = e.target.value === '' ? null : Number(e.target.value);
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
                                {previousQuestions.map((prevQ, i) => (
                                    <option key={i} value={i}>
                                        Q{i + 1}: {prevQ.question || 'Senza testo'}
                                    </option>
                                ))}
                            </select>
                            {skipIfQuestionError && <span className={styles.errorText}>{skipIfQuestionError}</span>}

                            <select
                                className={`${styles.select} ${skipIfAnswerError ? styles.selectInvalid : ''}`}
                                value={skipIf.answerIndex !== null ? skipIf.answerIndex : ''}
                                onChange={(e) => {
                                    const val = e.target.value === '' ? null : Number(e.target.value);
                                    handleSkipIfChange('answerIndex', val);
                                }}
                                disabled={skipIf.questionIndex === null}
                            >
                                <option value="">-- Risposta che fa skippare --</option>
                                {(selectedPreviousQuestion?.answers || []).map((ans, i) => (
                                    <option key={i} value={i}>
                                        {ans || `Risposta ${i + 1}`}
                                    </option>
                                ))}
                            </select>
                            {skipIfAnswerError && <span className={styles.errorText}>{skipIfAnswerError}</span>}
                        </div>
                    )}
                </div>
            )}
        </EditorCardWrapper>
    );
};