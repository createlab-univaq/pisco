'use client';

import { useId } from 'react';
import styles from './SingleSelectAnswersField.module.css';

// Reusable SVGs replacing Chakra Icons
const AddIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

const CloseIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export type SingleSelectAnswersFieldProps = {
    label: string;
    answers: string[];
    correctIndex: number | null;
    onAnswersChange: (answers: string[]) => void;
    onCorrectIndexChange: (index: number | null) => void;
    minAnswers?: number;
    defaultAnswers?: string[];
    allowNoCorrect?: boolean;
    noCorrectLabel?: string;
    isDisabled?: boolean;
};

const SingleSelectAnswersField = ({
    label,
    answers = [],
    correctIndex,
    onAnswersChange,
    onCorrectIndexChange,
    minAnswers = 2,
    defaultAnswers = ['', ''],
    allowNoCorrect = false,
    noCorrectLabel = 'Nessuna risposta corretta',
    isDisabled = false,
}: SingleSelectAnswersFieldProps) => {
    // Generate a unique name for the radio group so multiple instances don't clash
    const radioGroupId = useId();

    // Inizializzo se l'array è vuoto
    const effectiveAnswers = answers.length ? answers : defaultAnswers;

    // Normalizza answers + clamp correctIndex se serve
    const handleAnswersChange = (next: string[]) => {
        // Mantengo almeno minAnswers risposte
        const normalized = next.length >= minAnswers
            ? next
            : [
                ...next,
                ...Array.from({ length: minAnswers - next.length }, () => ''),
            ];

        onAnswersChange(normalized);

        // Se correctIndex è un numero, lo tengo dentro range
        if (typeof correctIndex === 'number') {
            const maxIndex = Math.max(0, normalized.length - 1);
            if (correctIndex > maxIndex) {
                onCorrectIndexChange(maxIndex);
            }
        }
    };

    const handleTextChange = (idx: number, val: string) => {
        const updated = [...effectiveAnswers];
        updated[idx] = val;
        handleAnswersChange(updated);
    };

    const handleRemoveAnswer = (idx: number) => {
        handleAnswersChange(effectiveAnswers.filter((_, i) => i !== idx));
    };

    const handleAddAnswer = () => {
        handleAnswersChange([...effectiveAnswers, '']);
    };

    return (
        <div className={styles.container}>
            <h4 className={styles.label}>{label}</h4>

            <div className={styles.radioGroup}>

                {/* Opzione "nessuna corretta" disponibile solo se abilitata (es: Faux Pas) */}
                {allowNoCorrect && (
                    <label className={styles.radioRow}>
                        <input
                            type="radio"
                            name={radioGroupId}
                            value="none"
                            checked={correctIndex === null}
                            onChange={() => onCorrectIndexChange(null)}
                            disabled={isDisabled}
                            className={styles.radioInput}
                        />
                        <span className={styles.radioLabel}>{noCorrectLabel}</span>
                    </label>
                )}

                {effectiveAnswers.map((answer, idx) => (
                    <div key={idx} className={styles.row}>

                        <input
                            type="radio"
                            name={radioGroupId}
                            value={String(idx)}
                            checked={correctIndex === idx}
                            onChange={() => onCorrectIndexChange(idx)}
                            disabled={isDisabled}
                            className={styles.radioInput}
                            title="Segna come corretta"
                        />

                        <input
                            type="text"
                            value={answer ?? ''}
                            placeholder={`Answer ${idx + 1}`}
                            onChange={(e) => handleTextChange(idx, e.target.value)}
                            disabled={isDisabled}
                            className={styles.textInput}
                        />

                        <button
                            type="button"
                            className={styles.removeBtn}
                            onClick={() => handleRemoveAnswer(idx)}
                            disabled={isDisabled || effectiveAnswers.length <= minAnswers}
                            aria-label="Remove answer"
                            title="Rimuovi risposta"
                        >
                            <CloseIcon />
                        </button>
                    </div>
                ))}
            </div>

            <button
                type="button"
                className={styles.addBtn}
                onClick={handleAddAnswer}
                disabled={isDisabled}
            >
                <AddIcon />
                <span>Add answer</span>
            </button>
        </div>
    );
};

export default SingleSelectAnswersField;