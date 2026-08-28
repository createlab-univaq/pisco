'use client';

import TextField from '@/components/forms/TextField';
import styles from './QuestionEditor.module.css';

const CloseIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export type QuestionEditorProps = {
    index: number;
    questionText: string;
    isCorrect: boolean;
    onChange: (updatedText: string, updatedIsCorrect: boolean) => void;
    onRemove: () => void;
};

export const QuestionEditor = ({ index, questionText, isCorrect, onChange, onRemove }: QuestionEditorProps) => {
    return (
        <div className={styles.questionCard}>
            <div className={styles.cardHeader}>
                <h5 className={styles.cardTitle}>Quesito #{index + 1}</h5>
                <button type="button" className={styles.removeBtnSmall} onClick={onRemove}>
                    <CloseIcon />
                    <span>Rimuovi</span>
                </button>
            </div>

            <TextField
                label="Testo della domanda"
                name={`q-${index}-text`}
                value={questionText || ''}
                onChange={(e) => onChange(e.target.value, isCorrect)}
            />

            <div className={styles.radioContainer}>
                <label className={styles.radioTitle}>Risposta corretta:</label>
                <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name={`correct-ans-${index}`}
                            checked={isCorrect === true}
                            onChange={() => onChange(questionText, true)}
                        />
                        Vero
                    </label>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name={`correct-ans-${index}`}
                            checked={isCorrect === false}
                            onChange={() => onChange(questionText, false)}
                        />
                        Falso
                    </label>
                </div>
            </div>
        </div>
    );
};