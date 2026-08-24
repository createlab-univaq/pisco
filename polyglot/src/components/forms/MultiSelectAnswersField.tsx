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

export type AnswerValue = {
    text: string;
    score: number;
};

type AnswerRowProps = {
    value: AnswerValue;
    isCorrect: boolean;
    idx: number;
    canRemove: boolean;
    onTextChange: (text: string) => void;
    onScoreChange: (score: number) => void;
    onToggleCorrect: (idx: number) => void;
    onRemove: (idx: number) => void;
};

const AnswerRow = ({
    value,
    isCorrect,
    idx,
    canRemove,
    onTextChange,
    onScoreChange,
    onToggleCorrect,
    onRemove,
}: AnswerRowProps) => {

    const handleScoreChange = (raw: string) => {
        const n = raw === '' ? 0 : Number(raw);
        onScoreChange(Number.isFinite(n) ? n : 0);
    };

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
                    value={value.text ?? ''}
                    placeholder={`Risposta ${idx + 1}`}
                    onChange={(e) => onTextChange(e.target.value)}
                    className={styles.inputUnstyled}
                />
            </div>

            {/* Box: punteggio */}
            <div className={`${styles.inputBox} ${styles.scoreBox}`}>
                <input
                    type="number"
                    value={Number.isFinite(value.score) ? value.score : 0}
                    placeholder="Punti"
                    onChange={(e) => handleScoreChange(e.target.value)}
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
    answers: AnswerValue[];
    correctIndexes: number[];
    onAnswersChange: (newAnswers: AnswerValue[]) => void;
    onCorrectIndexesChange: (newIndexes: number[]) => void;
    minAnswers?: number;
};

const MultiSelectAnswersField = ({
    label,
    answers = [],
    correctIndexes = [],
    onAnswersChange,
    onCorrectIndexesChange,
    minAnswers = 0,
}: MultiSelectAnswersFieldProps) => {

    // Aggiunge/toglie l'indice dall'array correctIndexes
    const toggleCorrect = (idx: number) => {
        const exists = correctIndexes.includes(idx);

        const next = exists
            ? correctIndexes.filter((x) => x !== idx)
            : [...correctIndexes, idx];

        next.sort((a, b) => a - b);
        onCorrectIndexesChange(next);
    };

    const updateAnswerText = (idx: number, text: string) => {
        const newAnswers = [...answers];
        newAnswers[idx] = { ...newAnswers[idx], text };
        onAnswersChange(newAnswers);
    };

    const updateAnswerScore = (idx: number, score: number) => {
        const newAnswers = [...answers];
        newAnswers[idx] = { ...newAnswers[idx], score };
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
        onAnswersChange([...answers, { text: '', score: 0 }]);
    };

    const canRemove = answers.length > minAnswers;

    return (
        <div className={styles.container}>
            <h4 className={styles.label}>{label}</h4>

            <div className={styles.stack}>
                {answers.map((ans, idx) => (
                    <AnswerRow
                        key={idx} // Fallback index key, safe here as array is completely rebuilt and synced
                        value={ans}
                        isCorrect={correctIndexes.includes(idx)}
                        idx={idx}
                        canRemove={canRemove}
                        onTextChange={(text) => updateAnswerText(idx, text)}
                        onScoreChange={(score) => updateAnswerScore(idx, score)}
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
        </div>
    );
};

export default MultiSelectAnswersField;