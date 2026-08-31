'use client';

import { useState } from 'react';
import styles from './TrueFalseArrayField.module.css';

const CheckIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const CloseIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const AddIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

type TrueFalseArrayFieldProps = {
    label: string;
    optionLabel?: string;
    questions: string[];
    isCorrect: boolean[];
    onChange: (questions: string[], isCorrect: boolean[]) => void;
    error?: string;
};

const TrueFalseArrayField = ({
    label,
    optionLabel = 'Question',
    questions = [],
    isCorrect = [],
    onChange,
    error,
}: TrueFalseArrayFieldProps) => {
    const [newInput, setNewInput] = useState('');
    const [newChecked, setNewChecked] = useState(false);

    const containerClass = `${styles.container} ${error ? styles.containerInvalid : ''}`;

    const handleUpdateText = (index: number, text: string) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index] = text;
        onChange(updatedQuestions, isCorrect);
    };

    const handleToggleCorrect = (index: number) => {
        const updatedIsCorrect = [...isCorrect];
        updatedIsCorrect[index] = !updatedIsCorrect[index];
        onChange(questions, updatedIsCorrect);
    };

    const handleRemove = (index: number) => {
        const updatedQuestions = questions.filter((_, i) => i !== index);
        const updatedIsCorrect = isCorrect.filter((_, i) => i !== index);
        onChange(updatedQuestions, updatedIsCorrect);
    };

    const handleAdd = () => {
        if (!newInput.trim()) return;
        onChange([...questions, newInput], [...isCorrect, newChecked]);
        setNewInput('');
        setNewChecked(false);
    };

    return (
        <div className={containerClass}>
            <label className={styles.mainLabel}>{label}</label>

            {questions.map((question, index) => (
                <div key={index} className={styles.row}>
                    <button
                        type="button"
                        className={`${styles.toggleBtn} ${isCorrect[index] ? styles.toggleTrue : `${styles.toggleFalse} ${styles.filled}`}`}
                        onClick={() => handleToggleCorrect(index)}
                        title={isCorrect[index] ? 'Mark as False' : 'Mark as True'}
                    >
                        {isCorrect[index] ? <CheckIcon /> : <CloseIcon />}
                    </button>

                    <div className={styles.inputWrapper}>
                        <label className={styles.floatingLabel}>
                            {optionLabel} {index + 1}
                        </label>
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => handleUpdateText(index, e.target.value)}
                            className={styles.input}
                        />
                    </div>

                    <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => handleRemove(index)}
                        title="Remove question"
                    >
                        <CloseIcon />
                    </button>
                </div>
            ))}

            <div className={styles.row}>
                <button
                    type="button"
                    className={`${styles.toggleBtn} ${newChecked ? styles.toggleTrue : `${styles.toggleFalse} ${styles.filled}`}`}
                    onClick={() => setNewChecked(!newChecked)}
                    title={newChecked ? 'Mark as False' : 'Mark as True'}
                >
                    {newChecked ? <CheckIcon /> : <CloseIcon />}
                </button>

                <div className={styles.inputWrapper}>
                    <input
                        type="text"
                        value={newInput}
                        onChange={(e) => setNewInput(e.target.value)}
                        placeholder="Insert new choice.."
                        className={styles.input}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAdd();
                            }
                        }}
                    />
                </div>

                <button
                    type="button"
                    className={styles.addBtn}
                    onClick={handleAdd}
                    disabled={!newInput.trim()}
                    title="Add question"
                >
                    <AddIcon />
                </button>
            </div>

            {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
};

export default TrueFalseArrayField;