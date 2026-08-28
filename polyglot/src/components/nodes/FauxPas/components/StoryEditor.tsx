'use client';

import TextField from '@/components/forms/TextField';
import styles from './StoryEditor.module.css';
import { FauxPasQuizItem, FauxPasQuestion } from '../types';
import { QuestionEditor } from './QuestionEditor';

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

export type StoryEditorProps = {
    story: FauxPasQuizItem;
    index: number;
    onChange: (updated: FauxPasQuizItem) => void;
    onRemove: () => void;
};

export const StoryEditor = ({ story, index, onChange, onRemove }: StoryEditorProps) => {
    const questions = story.questions || [];

    const handleUpdateQuestion = (qIndex: number, updatedQuestion: FauxPasQuestion) => {
        const newQuestions = [...questions];
        newQuestions[qIndex] = updatedQuestion;
        onChange({ ...story, questions: newQuestions });
    };

    const handleAddQuestion = () => {
        onChange({
            ...story,
            questions: [
                ...questions,
                {
                    question: '',
                    answers: ['Si', 'No'],
                    correctIndex: 0,
                    skipIf: { enabled: false, questionIndex: null, answerIndex: null }
                }
            ]
        });
    };

    const handleRemoveQuestion = (qIndex: number) => {
        onChange({
            ...story,
            questions: questions.filter((_, i) => i !== qIndex)
        });
    };

    return (
        <div className={styles.storyCard}>
            <div className={styles.cardHeader}>
                <h4 className={styles.cardTitle}>Story #{index + 1}</h4>
                <button type="button" className={styles.removeBtnSmall} onClick={onRemove}>
                    <CloseIcon />
                    <span>Remove story</span>
                </button>
            </div>

            <TextField
                label="Narration"
                name={`story-${index}-narration`}
                value={story.narration || ''}
                onChange={(e) => onChange({ ...story, narration: e.target.value })}
                isTextArea
            />

            <hr className={styles.divider} />

            <div className={styles.subHeaderFlex}>
                <h5 className={styles.subTitle}>Questions</h5>
                <button type="button" className={styles.addBtnSmall} onClick={handleAddQuestion}>
                    <AddIcon />
                    <span>Add question</span>
                </button>
            </div>

            {/* Questions Empty State */}
            {questions.length === 0 && (
                <div className={styles.emptyState}>
                    <p className={styles.emptyText}>
                        Nessuna domanda. Clicca <b>Add question</b> per iniziare.
                    </p>
                </div>
            )}

            <div className={styles.questionsList}>
                {questions.map((q, i) => (
                    <QuestionEditor
                        key={i}
                        question={q}
                        index={i}
                        allQuestions={questions}
                        onChange={(updated) => handleUpdateQuestion(i, updated)}
                        onRemove={() => handleRemoveQuestion(i)}
                    />
                ))}
            </div>

            {/* Questions Dual-Placement Add Button */}
            {questions.length > 0 && (
                <button
                    type="button"
                    className={`${styles.addBtnSmall} ${styles.fullWidthBtn}`}
                    onClick={handleAddQuestion}
                >
                    <AddIcon />
                    <span>Add question</span>
                </button>
            )}
        </div>
    );
};