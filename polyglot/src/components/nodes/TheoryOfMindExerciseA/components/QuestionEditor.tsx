'use client';

import TextField from '@/components/forms/TextField';
import styles from './QuestionEditor.module.css';
import { TheoryOfMindExerciseAQuestion } from '../types';

export type QuestionEditorProps = {
    question: TheoryOfMindExerciseAQuestion;
    index: number;
    onChange: (updated: TheoryOfMindExerciseAQuestion) => void;
};

export const QuestionEditor = ({ question, index, onChange }: QuestionEditorProps) => {
    return (
        <div className={styles.questionCard}>
            <h5 className={styles.cardTitle}>Domanda #{index + 1}</h5>

            <TextField
                label="Testo della domanda"
                name={`q-${index}-text`}
                value={question.question || ''}
                onChange={(e) => onChange({ ...question, question: e.target.value })}
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
            </div>

            <TextField
                label="Spiegazione"
                name={`q-${index}-explanation`}
                value={question.explanation || ''}
                onChange={(e) => onChange({ ...question, explanation: e.target.value })}
                isTextArea
            />
        </div>
    );
};