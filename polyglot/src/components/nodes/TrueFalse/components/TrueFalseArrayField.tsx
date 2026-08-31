'use client';

import { useState } from 'react';
import styles from './TrueFalseArrayField.module.css';

const AddIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

const CloseIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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
                        className={`${styles.toggleBtn} ${isCorrect[index] ? styles.toggleTrue : styles.toggleFalse}`}
                        onClick={() => handleToggleCorrect(index)}
                        title="Clicca per invertire Vero/Falso"
                    >
                        {isCorrect[index] ? 'Vero' : 'Falso'}
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
                            placeholder="Inserisci affermazione..."
                        />
                    </div>

                    <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => handleRemove(index)}
                        title="Rimuovi affermazione"
                    >
                        <CloseIcon />
                    </button>
                </div>
            ))}

            <div className={styles.row}>
                <button
                    type="button"
                    className={`${styles.toggleBtn} ${newChecked ? styles.toggleTrue : styles.toggleFalse}`}
                    onClick={() => setNewChecked(!newChecked)}
                    title="Clicca per invertire Vero/Falso"
                >
                    {newChecked ? 'Vero' : 'Falso'}
                </button>

                <div className={styles.inputWrapper}>
                    <input
                        type="text"
                        value={newInput}
                        onChange={(e) => setNewInput(e.target.value)}
                        placeholder="Inserisci nuova affermazione..."
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
                    title="Aggiungi affermazione"
                >
                    <AddIcon />
                </button>
            </div>

            {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
};

export default TrueFalseArrayField;