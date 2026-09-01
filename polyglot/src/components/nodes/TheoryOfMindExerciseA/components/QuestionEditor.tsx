'use client';

import TextField from '@/components/forms/TextField';
import styles from './QuestionEditor.module.css';
import { TheoryOfMindExerciseAQuestion } from '../types'; // Adjust path if needed
import { EditorCardWrapper } from '@/components/layouts/EditorCardWrapper';

export type QuestionEditorProps = {
    question: TheoryOfMindExerciseAQuestion;
    index: number;
    itemIndex: number; // <-- FIX: Add itemIndex to props
    onChange: (updated: TheoryOfMindExerciseAQuestion) => void;
    getFieldError: (path: string) => string | undefined;
};

export const QuestionEditor = ({ question, index, itemIndex, onChange, getFieldError }: QuestionEditorProps) => {

    // Check for radio button error
    const correctIndexError = getFieldError(`data.quiz.${itemIndex}.questions.${index}.correctIndex`);

    return (
        <EditorCardWrapper title={`Domanda #${index + 1}`}>
            <TextField
                label="Testo della domanda"
                name={`q-${index}-text`}
                value={question.question || ''}
                onChange={(e) => onChange({ ...question, question: e.target.value })}
                error={getFieldError(`data.quiz.${itemIndex}.questions.${index}.question`)}
            />

            <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                <label className={styles.sectionTitle} style={{ display: 'block', marginBottom: '6px' }}>
                    Risposta Corretta (Sì / No)
                </label>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.875rem' }}>
                        <input
                            type="radio"
                            name={`correct-ans-${index}-${question.qid}`}
                            checked={question.correctIndex === 0}
                            onChange={() => onChange({ ...question, correctIndex: 0 })}
                        />
                        Sì
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.875rem' }}>
                        <input
                            type="radio"
                            name={`correct-ans-${index}-${question.qid}`}
                            checked={question.correctIndex === 1}
                            onChange={() => onChange({ ...question, correctIndex: 1 })}
                        />
                        No
                    </label>
                </div>
                {correctIndexError && (
                    <span style={{ color: '#e53e3e', fontSize: '0.875rem', display: 'block', marginTop: '4px' }}>
                        {correctIndexError}
                    </span>
                )}
            </div>

            <TextField
                label="Spiegazione"
                name={`q-${index}-explanation`}
                value={question.explanation || ''}
                onChange={(e) => onChange({ ...question, explanation: e.target.value })}
                isTextArea
                error={getFieldError(`data.quiz.${itemIndex}.questions.${index}.explanation`)}
            />
        </EditorCardWrapper>
    );
};