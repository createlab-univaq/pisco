'use client';

import SingleSelectAnswersField from '@/components/forms/SingleSelectAnswersField';
import QuestionImageUploadField from '@/components/forms/QuestionImageUploadField';
import styles from './QuestionEditor.module.css';
import { EyesTaskQuestion } from '../types';
import { EditorCardWrapper, EditorCardDivider } from '@/components/layouts/EditorCardWrapper';

export type QuestionEditorProps = {
    question: EyesTaskQuestion;
    index: number;
    nodeId: string;
    isDeleting: boolean;
    onChange: (updated: EyesTaskQuestion) => void;
    onRemove: () => void;
    getFieldError: (path: string) => string | undefined;
};

export const QuestionEditor = ({ question, index, nodeId, isDeleting, onChange, onRemove, getFieldError }: QuestionEditorProps) => {

    return (
        <EditorCardWrapper
            title={`Quesito #${index + 1}`}
            onRemove={onRemove}
            isDeleting={isDeleting}
            removeLabel="Rimuovi quesito"
        >
            {nodeId ? (
                <QuestionImageUploadField
                    parentNodeId={nodeId}
                    imageId={question.imageId}
                    onImageIdChange={(newId: string | undefined) => onChange({ ...question, imageId: newId })}
                    error={getFieldError(`data.questions.${index}.imageId`)}
                />
            ) : (
                <p className={styles.hintText}>
                    Seleziona il nodo per caricare un’immagine.
                </p>
            )}

            <EditorCardDivider />

            <SingleSelectAnswersField
                label="Risposte (seleziona quella corretta)"
                answers={question.answers || ['', '']}
                correctIndex={question.correctIndex || 0}
                onAnswersChange={(newAnswers: string[]) => onChange({ ...question, answers: newAnswers })}
                onCorrectIndexChange={(newIndex: number | null) => onChange({ ...question, correctIndex: newIndex ?? 0 })}
                minAnswers={2}
                allowNoCorrect={false}
                error={getFieldError(`data.questions.${index}.answers`) || getFieldError(`data.questions.${index}.correctIndex`)}
            />
        </EditorCardWrapper>
    );
};