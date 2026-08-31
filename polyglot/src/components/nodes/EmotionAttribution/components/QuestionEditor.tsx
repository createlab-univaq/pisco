'use client';

import TextField from '@/components/forms/TextField';
import StringArrayField from '@/components/forms/StringArrayField';
import styles from './QuestionEditor.module.css';
import { EmotionAttributionQuestion } from '../types'; // Adjust path if needed
import { EditorCardDivider, EditorCardWrapper } from '@/components/layouts/EditorCardWrapper';

export type QuestionEditorProps = {
    question: EmotionAttributionQuestion;
    index: number;
    onChange: (updated: EmotionAttributionQuestion) => void;
    onRemove: () => void;
    getFieldError: (path: string) => string | undefined;
};

export const QuestionEditor = ({ question, index, onChange, onRemove, getFieldError }: QuestionEditorProps) => {

    return (
        <EditorCardWrapper
            title={`Quesito ${index + 1}`}
            onRemove={onRemove}
            removeLabel="Rimuovi quesito"
        >
            <TextField
                label="Narrazione"
                name={`questions-${index}-narration`}
                value={question.narration || ''}
                onChange={(e) => onChange({ ...question, narration: e.target.value })}
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

            <h4 className={styles.listHeading}>Risposte corrette (lista)</h4>

            <StringArrayField
                values={question.correctAnswers || []}
                onChange={(updatedAnswers) => onChange({ ...question, correctAnswers: updatedAnswers })}
                itemLabel="Risposta corretta"
                addLabel="Aggiungi risposta corretta"
                defaultItemValue=""
                keepAtLeastOne
                error={getFieldError(`data.questions.${index}.correctAnswers`)}
            />
        </EditorCardWrapper>
    );
};