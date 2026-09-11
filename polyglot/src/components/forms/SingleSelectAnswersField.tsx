'use client';

import { useId } from 'react';
import styles from './SingleSelectAnswersField.module.css';

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
    isDisabled?: boolean;
    error?: string;
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
    isDisabled = false,
    error,
}: SingleSelectAnswersFieldProps) => {
    const radioGroupId = useId();
    const containerClass = `${styles.container} ${error ? styles.containerInvalid : ''}`;

    const effectiveAnswers = answers.length ? answers : defaultAnswers;

    const handleAnswersChange = (next: string[]) => {
        // If allowNoCorrect is active, the static option counts as 1, so we need minAnswers + 1
        const min = allowNoCorrect ? minAnswers + 1 : minAnswers;
        const normalized = next.length >= min
            ? next
            : [
                ...next,
                ...Array.from({ length: min - next.length }, () => ''),
            ];

        onAnswersChange(normalized);

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
        if (allowNoCorrect && idx === 0) return; // Prevent removing the static label
        handleAnswersChange(effectiveAnswers.filter((_, i) => i !== idx));
    };

    const handleAddAnswer = () => {
        handleAnswersChange([...effectiveAnswers, '']);
    };

    return (
        <div className={containerClass}>
            <h4 className={styles.label}>{label}</h4>

            <div className={styles.radioGroup}>
                {effectiveAnswers.map((answer, idx) => {
                    const isStaticNoCorrectOption = allowNoCorrect && idx === 0;

                    return (
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

                            {isStaticNoCorrectOption ? (
                                <span style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#4a5568', fontWeight: 500 }}>
                                    {answer}
                                </span>
                            ) : (
                                <input
                                    type="text"
                                    value={answer ?? ''}
                                    placeholder={`Answer ${allowNoCorrect ? idx : idx + 1}`}
                                    onChange={(e) => handleTextChange(idx, e.target.value)}
                                    disabled={isDisabled}
                                    className={styles.textInput}
                                />
                            )}

                            <button
                                type="button"
                                className={styles.removeBtn}
                                onClick={() => handleRemoveAnswer(idx)}
                                disabled={isDisabled || isStaticNoCorrectOption || effectiveAnswers.length <= (allowNoCorrect ? minAnswers + 1 : minAnswers)}
                                aria-label="Remove answer"
                                title="Rimuovi risposta"
                                style={{ visibility: isStaticNoCorrectOption ? 'hidden' : 'visible' }}
                            >
                                <CloseIcon />
                            </button>
                        </div>
                    );
                })}
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

            {error && (
                <span className={styles.errorText}>
                    {error}
                </span>
            )}
        </div>
    );
};

export default SingleSelectAnswersField;