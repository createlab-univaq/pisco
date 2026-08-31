'use client';

import styles from './FauxPasExerciseACoreForm.module.css';
import { StoryEditor } from './StoryEditor';
import { validateFauxPasExerciseANode } from '../validate';
import { ValidationError } from '@/types/ValidationError';
import { FauxPasExerciseAData, FauxPasExerciseAQuizItem } from '../types';

const newId = (prefix: string) =>
    globalThis.crypto?.randomUUID?.() ??
    `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

const AddIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

type Props = {
    data: FauxPasExerciseAData;
    onChange: (newData: FauxPasExerciseAData) => void;
    isDisabled?: boolean;
    getExternalErrors?: ValidationError[];
};

export const FauxPasExerciseACoreForm = ({ data, onChange, isDisabled, getExternalErrors }: Props) => {
    const quizItems = data.quiz || [];

    const localErrors = validateFauxPasExerciseANode(data);
    const activeErrors = getExternalErrors || localErrors;

    const handleQuizChange = (newQuiz: FauxPasExerciseAQuizItem[]) => {
        onChange({ ...data, quiz: newQuiz });
    };

    const handleAddStory = () => {
        handleQuizChange([
            ...quizItems,
            { qid: newId('qid'), narration: '', explanation: '', questions: [] }
        ]);
    };

    const handleUpdateStory = (index: number, updatedStory: FauxPasExerciseAQuizItem) => {
        const updatedQuiz = [...quizItems];
        updatedQuiz[index] = updatedStory;
        handleQuizChange(updatedQuiz);
    };

    const handleRemoveStory = (index: number) => {
        handleQuizChange(quizItems.filter((_, i) => i !== index));
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
                <h3 className={styles.sectionTitle}>Stories</h3>
                {!isDisabled && (
                    <button type="button" className={styles.addBtnPrimary} onClick={handleAddStory}>
                        <AddIcon />
                        <span>Add story</span>
                    </button>
                )}
            </div>

            {quizItems.length === 0 && (
                <div className={styles.emptyState}>
                    <p className={styles.emptyText}>
                        Nessuna storia ancora. Clicca <b>Add story</b> per iniziare.
                    </p>
                </div>
            )}

            <div className={styles.storiesList}>
                {quizItems.map((story, i) => (
                    <StoryEditor
                        key={story.qid || i}
                        story={story}
                        index={i}
                        onChange={(updated) => handleUpdateStory(i, updated)}
                        onRemove={() => handleRemoveStory(i)}
                    // Pass isDisabled to StoryEditor if your component supports it
                    />
                ))}
            </div>

            {quizItems.length > 0 && !isDisabled && (
                <button
                    type="button"
                    className={`${styles.addBtnPrimary} ${styles.fullWidthBtn}`}
                    onClick={handleAddStory}
                >
                    <AddIcon />
                    <span>Add story</span>
                </button>
            )}
        </div>
    );
};