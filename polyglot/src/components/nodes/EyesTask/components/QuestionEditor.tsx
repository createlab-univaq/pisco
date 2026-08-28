'use client';

import SingleSelectAnswersField from '@/components/forms/SingleSelectAnswersField';
import QuestionImageUploadField from '@/components/forms/QuestionImageUploadField';
import styles from './QuestionEditor.module.css';
import { EyesTaskQuestion } from '../types';

const CloseIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export type QuestionEditorProps = {
    question: EyesTaskQuestion;
    index: number;
    nodeId: string;
    isDeleting: boolean;
    onChange: (updated: EyesTaskQuestion) => void;
    onRemove: () => void;
};

export const QuestionEditor = ({ question, index, nodeId, isDeleting, onChange, onRemove }: QuestionEditorProps) => {
    return (
        <div className={styles.questionCard}>
            <div className={styles.cardHeader}>
                <h4 className={styles.cardTitle}>Quesito #{index + 1}</h4>

                <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={onRemove}
                    disabled={isDeleting}
                    aria-label="Rimuovi quesito"
                    title="Rimuovi quesito"
                >
                    {isDeleting ? '...' : <CloseIcon />}
                </button>
            </div>

            {nodeId ? (
                <QuestionImageUploadField
                    parentNodeId={nodeId}
                    imageId={question.imageId}
                    onImageIdChange={(newId: string | undefined) => onChange({ ...question, imageId: newId })}
                />
            ) : (
                <p className={styles.hintText}>
                    Seleziona il nodo per caricare un’immagine.
                </p>
            )}

            <hr className={styles.innerDivider} />

            <SingleSelectAnswersField
                label="Risposte (seleziona quella corretta)"
                answers={question.answers || ['', '']}
                correctIndex={question.correctIndex || 0}
                onAnswersChange={(newAnswers: string[]) => onChange({ ...question, answers: newAnswers })}
                onCorrectIndexChange={(newIndex: number | null) => onChange({ ...question, correctIndex: newIndex ?? 0 })}
                minAnswers={2}
                allowNoCorrect={false}
            />
        </div>
    );
};