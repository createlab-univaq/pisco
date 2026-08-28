'use client';

import TextField from '@/components/forms/TextField';
import SingleSelectAnswersField from '@/components/forms/SingleSelectAnswersField';
import styles from './QuestionEditor.module.css';
import { TheoryOfMindQuestion } from '../types';

const CloseIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export type QuestionEditorProps = {
    question: TheoryOfMindQuestion;
    index: number;
    onChange: (updated: TheoryOfMindQuestion) => void;
    onRemove: () => void;
};

export const QuestionEditor = ({ question, index, onChange, onRemove }: QuestionEditorProps) => {
    return (
        <div className={styles.questionCard}>
            <div className={styles.cardHeader}>
                <h5 className={styles.cardTitle}>Q{index + 1}</h5>
                <button type="button" className={styles.removeBtnSmall} onClick={onRemove}>
                    <CloseIcon />
                    <span>Remove</span>
                </button>
            </div>

            <TextField
                label="Question"
                name={`q-${index}-text`}
                value={question.question || ''}
                onChange={(e) => onChange({ ...question, question: e.target.value })}
            />

            <SingleSelectAnswersField
                label="Answers"
                answers={question.answers || ['Si', 'No']}
                correctIndex={question.correctIndex !== null ? question.correctIndex : 0}
                onAnswersChange={(newAnswers) => onChange({ ...question, answers: newAnswers })}
                onCorrectIndexChange={(newIndex: number | null) => onChange({ ...question, correctIndex: newIndex })}
                minAnswers={2}
                defaultAnswers={['Si', 'No']}
                allowNoCorrect={false}
            />
        </div>
    );
};