'use client';

import styles from './MultiSelectAnswersField.module.css';

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

export type MultiSelectAnswersFieldProps = {
    label: string;
    answers: string[];
    correctIndexes: number[];
    onAnswersChange: (newAnswers: string[]) => void;
    onCorrectIndexesChange: (newIndexes: number[]) => void;
    onBulkChange?: (newAnswers: string[], newCorrectIndexes: number[]) => void; // <-- ADDED
    minAnswers?: number;
    error?: string;
};

const MultiSelectAnswersField = ({
    label,
    answers = [],
    correctIndexes = [],
    onAnswersChange,
    onCorrectIndexesChange,
    onBulkChange,
    minAnswers = 0,
    error,
}: MultiSelectAnswersFieldProps) => {

    const containerClass = `${styles.container} ${error ? styles.containerInvalid : ''}`;

    const toggleCorrect = (idx: number) => {
        const exists = correctIndexes.includes(idx);
        const next = exists
            ? correctIndexes.filter((x) => x !== idx)
            : [...correctIndexes, idx];

        next.sort((a, b) => a - b);
        onCorrectIndexesChange(next);
    };

    const updateAnswer = (idx: number, text: string) => {
        const newAnswers = [...answers];
        newAnswers[idx] = text;
        onAnswersChange(newAnswers);
    };

    const removeAnswer = (idxToRemove: number) => {
        const newAnswers = answers.filter((_, i) => i !== idxToRemove);
        const nextCorrect = correctIndexes
            .filter((x) => x !== idxToRemove)
            .map((x) => (x > idxToRemove ? x - 1 : x))
            .sort((a, b) => a - b);

        // FIX: Update both atomically if bulk change is supported
        if (onBulkChange) {
            onBulkChange(newAnswers, nextCorrect);
        } else {
            onAnswersChange(newAnswers);
            onCorrectIndexesChange(nextCorrect);
        }
    };

    const addAnswer = () => {
        onAnswersChange([...answers, '']);
    };

    const canRemove = answers.length > minAnswers;

    return (
        <div className={containerClass}>
            <h4 className={styles.label}>{label}</h4>

            <div className={styles.stack}>
                {answers.map((ans, idx) => {
                    const isCorrect = correctIndexes.includes(idx);

                    return (
                        <div key={`answer-item-${idx}`} className={styles.row}>
                            <div className={styles.checkboxWrap}>
                                <input
                                    type="checkbox"
                                    checked={isCorrect}
                                    onChange={() => toggleCorrect(idx)}
                                    className={styles.checkbox}
                                />
                            </div>

                            <div className={`${styles.inputBox} ${styles.textBox}`}>
                                <input
                                    type="text"
                                    value={ans ?? ''}
                                    placeholder={`Risposta ${idx + 1}`}
                                    onChange={(e) => updateAnswer(idx, e.target.value)}
                                    className={styles.inputUnstyled}
                                />
                            </div>

                            <button
                                type="button"
                                className={styles.removeBtn}
                                onClick={() => removeAnswer(idx)}
                                disabled={!canRemove}
                                aria-label="Remove answer"
                                title="Rimuovi risposta"
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
                onClick={addAnswer}
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

export default MultiSelectAnswersField;