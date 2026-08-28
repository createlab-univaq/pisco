'use client';

import TextField from '@/components/forms/TextField';
import StringArrayField from '@/components/forms/StringArrayField';
import styles from './QuestionEditor.module.css'; // <-- Importing decoupled CSS
import { EmotionAttributionQuestion } from '..';

const CloseIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export type QuestionEditorProps = {
    question: EmotionAttributionQuestion;
    index: number;
    onChange: (updated: EmotionAttributionQuestion) => void;
    onRemove: () => void;
};

export const QuestionEditor = ({ question, index, onChange, onRemove }: QuestionEditorProps) => {
    return (
        <div className={styles.questionCard}>
            <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>Quesito {index + 1}</span>
                <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={onRemove}
                    aria-label="Rimuovi quesito"
                    title="Rimuovi quesito"
                >
                    <CloseIcon />
                </button>
            </div>

            <TextField
                label="Narrazione"
                name={`questions-${index}-narration`}
                value={question.narration || ''}
                onChange={(e) => onChange({ ...question, narration: e.target.value })}
                isTextArea
            />

            <TextField
                label="Domanda"
                name={`questions-${index}-question`}
                value={question.question || ''}
                onChange={(e) => onChange({ ...question, question: e.target.value })}
                isTextArea
            />

            <hr className={styles.innerDivider} />

            <h4 className={styles.listHeading}>Risposte corrette (lista)</h4>

            <StringArrayField
                values={question.correctAnswers || []}
                onChange={(updatedAnswers) => onChange({ ...question, correctAnswers: updatedAnswers })}
                itemLabel="Risposta corretta"
                addLabel="Aggiungi risposta corretta"
                defaultItemValue=""
                keepAtLeastOne
            />
        </div>
    );
};