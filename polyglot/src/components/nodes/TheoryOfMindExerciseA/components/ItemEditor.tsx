'use client';

import TextField from '@/components/forms/TextField';
import QuestionImageUploadField from '@/components/forms/QuestionImageUploadField';
import styles from './ItemEditor.module.css';
import { TheoryOfMindExerciseAItem, TheoryOfMindExerciseAQuestion } from '../types';
import { QuestionEditor } from './QuestionEditor';

const newId = (prefix: string) =>
    globalThis.crypto?.randomUUID?.() ??
    `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

const CloseIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

// Exported so the root node can use it when adding a new item
export const createDefaultQuestions = (): TheoryOfMindExerciseAQuestion[] => [
    { qid: newId('q'), question: '', answers: ['Si', 'No'], correctIndex: 0, explanation: '' },
    { qid: newId('q'), question: '', answers: ['Si', 'No'], correctIndex: 0, explanation: '' },
];

export type ItemEditorProps = {
    item: TheoryOfMindExerciseAItem;
    index: number;
    nodeId: string;
    isDeleting: boolean;
    onChange: (updatedItem: TheoryOfMindExerciseAItem) => void;
    onRemove: () => void;
};

export const ItemEditor = ({ item, index, nodeId, isDeleting, onChange, onRemove }: ItemEditorProps) => {
    const questions = item.questions?.length === 2 ? item.questions : createDefaultQuestions();

    const handleUpdateQuestion = (qIndex: number, updatedQuestion: TheoryOfMindExerciseAQuestion) => {
        const newQuestions = [...questions] as [TheoryOfMindExerciseAQuestion, TheoryOfMindExerciseAQuestion];
        newQuestions[qIndex] = updatedQuestion;
        onChange({ ...item, questions: newQuestions });
    };

    return (
        <div className={styles.storyCard}>
            <div className={styles.cardHeader}>
                <h4 className={styles.cardTitle}>Elemento Immagine #{index + 1}</h4>
                <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={onRemove}
                    disabled={isDeleting}
                    aria-label="Rimuovi elemento"
                >
                    {isDeleting ? '...' : <CloseIcon />}
                </button>
            </div>

            {nodeId ? (
                <QuestionImageUploadField
                    parentNodeId={nodeId}
                    parentItemId={item.qid}
                    imageId={item.imageId}
                    onImageIdChange={(newId: string | undefined) => onChange({ ...item, imageId: newId })}
                />
            ) : (
                <p className={styles.hintText}>Seleziona il nodo per caricare un’immagine.</p>
            )}

            <hr className={styles.innerDivider} />

            <TextField
                label="Didascalia (Caption)"
                name={`item-${index}-caption`}
                value={item.caption || ''}
                onChange={(e) => onChange({ ...item, caption: e.target.value })}
                isTextArea
            />

            <div className={styles.subHeaderFlex}>
                <h5 className={styles.subTitle}>Domande (Fisse: 2)</h5>
            </div>

            <div className={styles.questionsList}>
                {questions.map((q, i) => (
                    <QuestionEditor
                        key={q.qid || i}
                        question={q}
                        index={i}
                        onChange={(updated) => handleUpdateQuestion(i, updated)}
                    />
                ))}
            </div>
        </div>
    );
};