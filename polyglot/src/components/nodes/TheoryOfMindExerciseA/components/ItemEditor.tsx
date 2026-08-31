'use client';

import TextField from '@/components/forms/TextField';
import QuestionImageUploadField from '@/components/forms/QuestionImageUploadField';
import styles from './ItemEditor.module.css';
import { TheoryOfMindExerciseAItem, TheoryOfMindExerciseAQuestion } from '../types';
import { QuestionEditor } from './QuestionEditor';
import { EditorCardWrapper, EditorCardDivider } from '@/components/layouts/EditorCardWrapper';

const newId = (prefix: string) =>
    globalThis.crypto?.randomUUID?.() ??
    `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

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
    getFieldError: (path: string) => string | undefined;
};

export const ItemEditor = ({ item, index, nodeId, isDeleting, onChange, onRemove, getFieldError }: ItemEditorProps) => {
    const questions = item.questions?.length === 2 ? item.questions : createDefaultQuestions();

    const handleUpdateQuestion = (qIndex: number, updatedQuestion: TheoryOfMindExerciseAQuestion) => {
        const newQuestions = [...questions] as [TheoryOfMindExerciseAQuestion, TheoryOfMindExerciseAQuestion];
        newQuestions[qIndex] = updatedQuestion;
        onChange({ ...item, questions: newQuestions });
    };

    return (
        <EditorCardWrapper
            title={`Elemento Immagine #${index + 1}`}
            onRemove={onRemove}
            isDeleting={isDeleting}
            removeLabel="Rimuovi elemento"
        >
            {nodeId ? (
                <QuestionImageUploadField
                    parentNodeId={nodeId}
                    parentItemId={item.qid}
                    imageId={item.imageId}
                    onImageIdChange={(newId: string | undefined) => onChange({ ...item, imageId: newId })}
                    error={getFieldError(`data.quiz.${index}.imageId`)}
                />
            ) : (
                <p className={styles.hintText}>Seleziona il nodo per caricare un’immagine.</p>
            )}

            <EditorCardDivider />

            <TextField
                label="Didascalia (Caption)"
                name={`item-${index}-caption`}
                value={item.caption || ''}
                onChange={(e) => onChange({ ...item, caption: e.target.value })}
                isTextArea
                error={getFieldError(`data.quiz.${index}.caption`)}
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
                        itemIndex={index}
                        onChange={(updated) => handleUpdateQuestion(i, updated)}
                        getFieldError={getFieldError}
                    />
                ))}
            </div>
        </EditorCardWrapper>
    );
};