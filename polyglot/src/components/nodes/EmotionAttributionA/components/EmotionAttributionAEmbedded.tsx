'use client';

import styles from './EmotionAttributionAEmbedded.module.css';
import { QuestionEditor, EmotionAttributionAQuestion } from './QuestionEditor';

const newId = () =>
    globalThis.crypto?.randomUUID?.() ??
    `q_${Date.now()}_${Math.random().toString(16).slice(2)}`;

const AddIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

export type EmotionAttributionAEmbeddedProps = {
    data: any;
    onChange: (newData: any) => void;
};

const EmotionAttributionAEmbedded = ({ data, onChange }: EmotionAttributionAEmbeddedProps) => {
    const questions: EmotionAttributionAQuestion[] = data?.questions || [];

    const handleAddQuestion = () => {
        onChange({
            ...data,
            questions: [
                ...questions,
                { qid: newId(), scenario: '', question: '', correctAnswers: [''], explanation: '' }
            ]
        });
    };

    const handleRemoveQuestion = (indexToRemove: number) => {
        onChange({
            ...data,
            questions: questions.filter((_, idx) => idx !== indexToRemove)
        });
    };

    const handleUpdateQuestion = (index: number, updatedQ: EmotionAttributionAQuestion) => {
        const newQuestions = [...questions];
        newQuestions[index] = updatedQ;
        onChange({ ...data, questions: newQuestions });
    };

    return (
        <div className={styles.container}>
            {/* Top Action Button */}
            <div className={styles.headerFlex}>
                <h3 className={styles.sectionTitle}>Quesiti</h3>
                <button type="button" className={styles.addBtn} onClick={handleAddQuestion}>
                    <AddIcon />
                    <span>Aggiungi Quesito</span>
                </button>
            </div>

            {/* Empty State Feedback */}
            {questions.length === 0 && (
                <div className={styles.emptyState}>
                    <p className={styles.emptyText}>
                        Nessun quesito ancora. Clicca <b>Aggiungi Quesito</b> per iniziare.
                    </p>
                </div>
            )}

            <div className={styles.questionsList}>
                {questions.map((q, index) => (
                    <QuestionEditor
                        key={q.qid || index}
                        question={q}
                        index={index}
                        onChange={(updated) => handleUpdateQuestion(index, updated)}
                        onRemove={() => handleRemoveQuestion(index)}
                    />
                ))}
            </div>

            {/* Bottom Action Button (Dual-Placement Standard) */}
            {questions.length > 0 && (
                <button
                    type="button"
                    className={`${styles.addBtn} ${styles.fullWidthBtn}`}
                    onClick={handleAddQuestion}
                >
                    <AddIcon />
                    <span>Aggiungi Quesito</span>
                </button>
            )}
        </div>
    );
};

export default EmotionAttributionAEmbedded;