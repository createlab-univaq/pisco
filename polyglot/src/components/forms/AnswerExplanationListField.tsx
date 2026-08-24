'use client';

import { useMemo } from 'react';
import styles from './AnswerExplanationListField.module.css';

// Reusable SVGs replacing Chakra icons
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

export type AnswerExplanationItem = {
    answer: string;
    explanation: string;
};

export type AnswerExplanationListFieldProps = {
    label: string;
    items: AnswerExplanationItem[];
    correctIndex: number;
    onItemsChange: (items: AnswerExplanationItem[]) => void;
    onCorrectIndexChange: (index: number) => void;
    answerLabel?: string;
    explanationLabel?: string;
    isDisabled?: boolean;
    keepAtLeastOne?: boolean;
};

const AnswerExplanationListField = ({
    label,
    items = [],
    correctIndex = 0,
    onItemsChange,
    onCorrectIndexChange,
    answerLabel = 'Risposta',
    explanationLabel = 'Spiegazione',
    isDisabled = false,
    keepAtLeastOne = true,
}: AnswerExplanationListFieldProps) => {

    const safeCorrectIndex = useMemo(() => {
        if (items.length === 0) return 0;
        return Math.min(Math.max(correctIndex, 0), items.length - 1);
    }, [correctIndex, items.length]);

    const handleAddItem = () => {
        const wasEmpty = items.length === 0;
        onItemsChange([...items, { answer: '', explanation: '' }]);
        if (wasEmpty) {
            onCorrectIndexChange(0);
        }
    };

    const handleRemoveItem = (index: number) => {
        if (keepAtLeastOne && items.length <= 1) return;

        const newItems = items.filter((_, i) => i !== index);
        onItemsChange(newItems);

        if (newItems.length === 0) {
            onCorrectIndexChange(0);
            return;
        }

        // Adjust correctIndex logically when an item is deleted
        if (index === safeCorrectIndex) {
            onCorrectIndexChange(0);
        } else if (index < safeCorrectIndex) {
            onCorrectIndexChange(safeCorrectIndex - 1);
        }
    };

    const handleUpdateItem = (index: number, field: keyof AnswerExplanationItem, value: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        onItemsChange(newItems);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <label className={styles.label}>{label}</label>
                <button
                    type="button"
                    className={styles.addBtn}
                    onClick={handleAddItem}
                    disabled={isDisabled}
                >
                    <AddIcon />
                    <span>Aggiungi risposta</span>
                </button>
            </div>

            {items.length === 0 && (
                <p className={styles.emptyText}>Nessuna risposta. Clicca &ldquo;Aggiungi risposta&rdquo;.</p>
            )}

            <div className={styles.list}>
                {items.map((item, index) => {
                    const isCorrect = safeCorrectIndex === index;
                    const disableRemove = isDisabled || (keepAtLeastOne && items.length <= 1);

                    return (
                        <div
                            key={index}
                            className={`${styles.card} ${isCorrect ? styles.cardCorrect : ''}`}
                            style={{ opacity: isDisabled ? 0.7 : 1 }}
                        >
                            <div className={styles.cardHeader}>
                                <label className={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name={`correct-answer-radio-${label}`}
                                        checked={isCorrect}
                                        onChange={() => onCorrectIndexChange(index)}
                                        disabled={isDisabled}
                                        className={styles.radioInput}
                                    />
                                    <span className={styles.correctText}>Corretta</span>
                                </label>

                                <span className={styles.optionIndex}>Opzione {index + 1}</span>

                                <button
                                    type="button"
                                    className={styles.removeBtn}
                                    onClick={() => handleRemoveItem(index)}
                                    disabled={disableRemove}
                                    title={keepAtLeastOne && items.length <= 1 ? 'Deve rimanere almeno una risposta' : undefined}
                                >
                                    <CloseIcon />
                                    <span>Rimuovi</span>
                                </button>
                            </div>

                            <input
                                type="text"
                                placeholder={answerLabel}
                                value={item.answer || ''}
                                onChange={(e) => handleUpdateItem(index, 'answer', e.target.value)}
                                disabled={isDisabled}
                                className={styles.input}
                            />

                            <textarea
                                placeholder={explanationLabel}
                                value={item.explanation || ''}
                                onChange={(e) => handleUpdateItem(index, 'explanation', e.target.value)}
                                disabled={isDisabled}
                                className={styles.textarea}
                                rows={2}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AnswerExplanationListField;