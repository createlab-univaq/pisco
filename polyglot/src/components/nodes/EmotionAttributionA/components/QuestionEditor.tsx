'use client';

import TextField from '@/components/forms/TextField';
import StringArrayField from '@/components/forms/StringArrayField';
import styles from './QuestionEditor.module.css';
import { EditorCardDivider, EditorCardWrapper } from '@/components/layouts/EditorCardWrapper';

// Adjust this import path depending on where your types are stored
export type EmotionAttributionAQuestion = {
    qid: string;
    scenario: string;
    question: string;
    correctAnswers: string[];
    explanation: string;
};

export type QuestionEditorProps = {
    question: EmotionAttributionAQuestion;
    index: number;
    onChange: (updated: EmotionAttributionAQuestion) => void;
    onRemove: () => void;
};

export const QuestionEditor = ({ question, index, onChange, onRemove }: QuestionEditorProps) => {
    return (
        <EditorCardWrapper
            title={`Quesito #${index + 1}`}
            onRemove={onRemove}
            removeLabel="Rimuovi quesito"
        >
            <TextField
                label="Scenario"
                name={`questions-${index}-scenario`}
                value={question.scenario || ''}
                onChange={(e) => onChange({ ...question, scenario: e.target.value })}
                isTextArea
            />

            <TextField
                label="Domanda"
                name={`questions-${index}-question`}
                value={question.question || ''}
                onChange={(e) => onChange({ ...question, question: e.target.value })}
                isTextArea
            />

            <EditorCardDivider />

            <h4 className={styles.listHeading}>Risposte corrette</h4>
            <StringArrayField
                values={question.correctAnswers || []}
                onChange={(updatedAnswers) => onChange({ ...question, correctAnswers: updatedAnswers })}
                itemLabel="Risposta corretta"
                addLabel="Aggiungi risposta corretta"
                defaultItemValue=""
                keepAtLeastOne
            />

            <EditorCardDivider />

            <TextField
                label="Spiegazione"
                name={`questions-${index}-explanation`}
                value={question.explanation || ''}
                onChange={(e) => onChange({ ...question, explanation: e.target.value })}
                isTextArea
            />
        </EditorCardWrapper>
    );
};