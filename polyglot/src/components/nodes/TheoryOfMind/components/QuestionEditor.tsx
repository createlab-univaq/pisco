'use client';

import TextField from '@/components/forms/TextField';
import SingleSelectAnswersField from '@/components/forms/SingleSelectAnswersField';
import { TheoryOfMindQuestion } from '../types';
import { EditorCardWrapper } from '@/components/layouts/EditorCardWrapper';

export type QuestionEditorProps = {
    question: TheoryOfMindQuestion;
    index: number;
    onChange: (updated: TheoryOfMindQuestion) => void;
    onRemove: () => void;
};

export const QuestionEditor = ({ question, index, onChange, onRemove }: QuestionEditorProps) => {
    return (
        <EditorCardWrapper
            title={`Q${index + 1}`}
            onRemove={onRemove}
            removeLabel="Remove"
        >
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
        </EditorCardWrapper>
    );
};