'use client';

import TextField from '@/components/forms/TextField';
import MultiSelectAnswersField from '@/components/forms/MultiSelectAnswersField';
import { SocialSituationSection } from '../types';
import { EditorCardWrapper, EditorCardDivider } from '@/components/layouts/EditorCardWrapper';

export type SectionEditorProps = {
    section: SocialSituationSection;
    sectionIndex: number;
    onChange: (updatedSection: SocialSituationSection) => void;
    onRemoveSection: () => void;
    itemIndex: number;
    getFieldError: (path: string) => string | undefined;
};

export const SectionEditor = ({ section, sectionIndex, onChange, onRemoveSection, itemIndex, getFieldError }: SectionEditorProps) => {
    return (
        <EditorCardWrapper
            title={`Sezione #${sectionIndex + 1}`}
            onRemove={onRemoveSection}
            removeLabel="Rimuovi sezione"
        >
            <TextField
                label="Testo iniziale"
                name={`section-${sectionIndex}-before`}
                value={section.before || ''}
                onChange={(e) => onChange({ ...section, before: e.target.value })}
                isTextArea
                error={getFieldError(`data.items.${itemIndex}.sections.${sectionIndex}.before`)}
            />
            <TextField
                label="Parte in grassetto"
                name={`section-${sectionIndex}-bold`}
                value={section.bold || ''}
                onChange={(e) => onChange({ ...section, bold: e.target.value })}
                error={getFieldError(`data.items.${itemIndex}.sections.${sectionIndex}.bold`)}
            />
            <TextField
                label="Testo finale"
                name={`section-${sectionIndex}-after`}
                value={section.after || ''}
                onChange={(e) => onChange({ ...section, after: e.target.value })}
                isTextArea
                error={getFieldError(`data.items.${itemIndex}.sections.${sectionIndex}.after`)}
            />

            <EditorCardDivider />

            <MultiSelectAnswersField
                label="Risposte"
                answers={section.answers || []}
                correctIndexes={section.correctIndexes || []}
                onAnswersChange={(newAnswers: string[]) => onChange({ ...section, answers: newAnswers })}
                onCorrectIndexesChange={(newIndexes: number[]) => onChange({ ...section, correctIndexes: newIndexes })}
                error={getFieldError(`data.items.${itemIndex}.sections.${sectionIndex}.answers`) || getFieldError(`data.items.${itemIndex}.sections.${sectionIndex}.correctIndexes`)}
            />
        </EditorCardWrapper>
    );
};