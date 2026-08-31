'use client';

import TextField from '@/components/forms/TextField';
import { EmotionAttributionExerciseBItem } from '../types'; // Adjust path if needed
import { EditorCardWrapper, EditorCardDivider } from '@/components/layouts/EditorCardWrapper';

export type ItemEditorProps = {
    item: EmotionAttributionExerciseBItem;
    index: number;
    onChange: (updated: EmotionAttributionExerciseBItem) => void;
    onRemove: () => void;
    getFieldError: (path: string) => string | undefined;
};

export const ItemEditor = ({ item, index, onChange, onRemove, getFieldError }: ItemEditorProps) => {

    return (
        <EditorCardWrapper
            title={`Elemento #${index + 1}`}
            onRemove={onRemove}
            removeLabel="Rimuovi elemento"
        >
            <TextField
                label="Emozione"
                name={`items-${index}-emotion`}
                value={item.emotion || ''}
                onChange={(e) => onChange({ ...item, emotion: e.target.value })}
                error={getFieldError(`data.items.${index}.emotion`)}
            />

            <TextField
                label="Scenario"
                name={`items-${index}-scenario`}
                value={item.scenario || ''}
                onChange={(e) => onChange({ ...item, scenario: e.target.value })}
                isTextArea
                error={getFieldError(`data.items.${index}.emotion`)}
            />

            <EditorCardDivider />

            <TextField
                label="Spiegazione dello scenario"
                name={`items-${index}-explanation`}
                value={item.explanation || ''}
                onChange={(e) => onChange({ ...item, explanation: e.target.value })}
                isTextArea
                error={getFieldError(`data.items.${index}.emotion`)}
            />
        </EditorCardWrapper>
    );
};