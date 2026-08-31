'use client';

import { useState } from 'react';
import styles from './TheoryOfMindExerciseACoreForm.module.css';
import { ItemEditor, createDefaultQuestions } from './ItemEditor';
import { validateTheoryOfMindExerciseANode } from '../validate';
import { ValidationError } from '@/types/ValidationError';
import { TheoryOfMindExerciseAData, TheoryOfMindExerciseAItem } from '../types';
import { deleteImageAction } from '@/lib/actions/images';

const newId = (prefix: string) =>
    globalThis.crypto?.randomUUID?.() ??
    `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

const AddIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

type Props = {
    data: TheoryOfMindExerciseAData;
    onChange: (newData: TheoryOfMindExerciseAData) => void;
    nodeId?: string;
    isDisabled?: boolean;
    getExternalErrors?: ValidationError[];
};

export const TheoryOfMindExerciseACoreForm = ({ data, onChange, nodeId = 'embedded', isDisabled, getExternalErrors }: Props) => {
    const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
    const quizItems = data.quiz || [];

    const localErrors = validateTheoryOfMindExerciseANode(data);
    const activeErrors = getExternalErrors || localErrors;

    const getFieldError = (path: string) => activeErrors.find((e) => e.path === path)?.message;
    const quizError = getFieldError('data.quiz');

    const handleQuizChange = (newQuiz: TheoryOfMindExerciseAItem[]) => {
        onChange({ ...data, quiz: newQuiz });
    };

    const handleAddItem = () => {
        handleQuizChange([
            ...quizItems,
            {
                qid: newId('qid'),
                imageId: undefined,
                caption: '',
                questions: createDefaultQuestions(),
            }
        ]);
    };

    const handleUpdateItem = (index: number, updatedItem: TheoryOfMindExerciseAItem) => {
        const updatedQuiz = [...quizItems];
        updatedQuiz[index] = updatedItem;
        handleQuizChange(updatedQuiz);
    };

    const handleRemoveItem = async (index: number) => {
        const itemToDelete = quizItems[index];
        const imageIdToDelete = itemToDelete?.imageId;

        setDeletingIndex(index);

        if (imageIdToDelete) {
            try {
                await deleteImageAction(imageIdToDelete);
            } catch (e) {
                console.error('Delete image failed', e);
                window.alert('Immagine non eliminata: Non sono riuscito a eliminare l’immagine associata. Riprova più tardi.');
                setDeletingIndex(null);
                return;
            }
        }

        handleQuizChange(quizItems.filter((_, i) => i !== index));
        setDeletingIndex(null);
    };

    return (
        <div className={styles.container}>
            {activeErrors.length > 0 && !getExternalErrors && (
                <div style={{ padding: '0 0.5rem', marginBottom: '0.5rem', color: '#e53e3e', fontSize: '0.875rem' }}>
                    <strong>Validation Errors:</strong>
                    <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                        {activeErrors.map((err, idx) => (
                            <li key={idx}>[{err.path}]: {err.message}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className={styles.headerFlex}>
                <h3 className={styles.sectionTitle}>Elementi Teoria della Mente</h3>
                {!isDisabled && (
                    <button type="button" className={styles.addBtn} onClick={handleAddItem}>
                        <AddIcon />
                        <span>Aggiungi elemento</span>
                    </button>
                )}
            </div>

            {quizItems.length === 0 && (
                <>
                    <div className={`${styles.emptyState} ${quizError ? styles.emptyStateInvalid : ''}`}>
                        <p className={styles.emptyText}>
                            Nessun elemento ancora. Clicca <b>Aggiungi elemento</b> per iniziare.
                        </p>
                    </div>
                    {quizError && <div className={styles.errorText}>{quizError}</div>}
                </>
            )}

            <div className={styles.storiesList}>
                {quizItems.map((item, i) => (
                    <ItemEditor
                        key={item.qid || i}
                        item={item}
                        index={i}
                        nodeId={nodeId}
                        isDeleting={deletingIndex === i}
                        onChange={(updated) => handleUpdateItem(i, updated)}
                        onRemove={() => handleRemoveItem(i)}
                        getFieldError={getFieldError}
                    />
                ))}
            </div>

            {quizItems.length > 0 && !isDisabled && (
                <button
                    type="button"
                    className={`${styles.addBtn} ${styles.fullWidthBtn}`}
                    onClick={handleAddItem}
                >
                    <AddIcon />
                    <span>Aggiungi elemento</span>
                </button>
            )}
        </div>
    );
};