'use client';

import styles from './MultiSelectAnswersField.module.css';

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

type AnswerRowProps = {
    value: string;
    isCorrect: boolean;
    idx: number;
    canRemove: boolean;
    onChange: (text: string) => void;
    onToggleCorrect: (idx: number) => void;
    onRemove: (idx: number) => void;
};

const AnswerRow = ({
    value,
    isCorrect,
    idx,
    canRemove,
    onChange,
    onToggleCorrect,
    onRemove,
}: AnswerRowProps) => {
    return (
        <div className={styles.row}>
            {/* Checkbox */}
            <div className={styles.checkboxWrap}>
                <input
                    type="checkbox"
                    checked={isCorrect}
                    onChange={() => onToggleCorrect(idx)}
                    className={styles.checkbox}
                />
            </div>

            {/* Box: testo risposta */}
            <div className={`${styles.inputBox} ${styles.textBox}`}>
                <input
                    type="text"
                    value={value ?? ''}
                    placeholder={`Risposta ${idx + 1}`}
                    onChange={(e) => onChange(e.target.value)}
                    className={styles.inputUnstyled}
                />
            </div>

            {/* Pulsante rimozione */}
            <button
                type="button"
                className={styles.removeBtn}
                onClick={() => onRemove(idx)}
                disabled={!canRemove}
                aria-label="Remove answer"
                title="Rimuovi risposta"
            >
                <CloseIcon />
            </button>
        </div>
    );
};

export type MultiSelectAnswersFieldProps = {
    label: string;
    answers: string[];
    correctIndexes: number[];
    onAnswersChange: (newAnswers: string[]) => void;
    onCorrectIndexesChange: (newIndexes: number[]) => void;
    minAnswers?: number;
    error?: string;
};

const MultiSelectAnswersField = ({
    label,
    answers = [],
    correctIndexes = [],
    onAnswersChange,
    onCorrectIndexesChange,
    minAnswers = 0,
    error,
}: MultiSelectAnswersFieldProps) => {

    const containerClass = `${styles.container} ${error ? styles.containerInvalid : ''}`;

    // Aggiunge/toglie l'indice dall'array correctIndexes
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

    // Rimuove una risposta e riallinea gli indici corretti
    const removeAnswer = (idx: number) => {
        // 1) Rimuovo dalla lista risposte
        const newAnswers = answers.filter((_, i) => i !== idx);
        onAnswersChange(newAnswers);

        // 2) Aggiorno correctIndexes:
        // - tolgo idx
        // - scalo di -1 quelli maggiori di idx per riallineare l'array
        const nextCorrect = correctIndexes
            .filter((x) => x !== idx)
            .map((x) => (x > idx ? x - 1 : x))
            .sort((a, b) => a - b);

        onCorrectIndexesChange(nextCorrect);
    };

    const addAnswer = () => {
        onAnswersChange([...answers, '']);
    };

    const canRemove = answers.length > minAnswers;

    return (
        <div className={containerClass}>
            <h4 className={styles.label}>{label}</h4>

            <div className={styles.stack}>
                {answers.map((ans, idx) => (
                    <AnswerRow
                        key={idx} // Fallback index key, safe here as array is completely rebuilt and synced
                        value={ans}
                        isCorrect={correctIndexes.includes(idx)}
                        idx={idx}
                        canRemove={canRemove}
                        onChange={(text) => updateAnswer(idx, text)}
                        onToggleCorrect={toggleCorrect}
                        onRemove={removeAnswer}
                    />
                ))}
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