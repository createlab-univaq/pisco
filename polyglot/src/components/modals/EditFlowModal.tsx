'use client';

import { useEffect, useState } from 'react';
import styles from './EditFlowModal.module.css';
import { PolyglotFlowInfo } from '@/types/polyglot-elements/PolyglotFlowInfo';
import { PolyglotFlow } from '@/types/polyglot-elements/PolyglotFlow';

type EditFlowModalProps = {
    isOpen: boolean;
    onClose: () => void;
    flow: PolyglotFlow;
    updateInfo: (flowInfo: PolyglotFlowInfo) => void;
};

// Replaces Chakra's colorScheme logic with raw hex codes
const COLORS = [
    '#3182ce', // blue
    '#38a169', // green
    '#e53e3e', // red
    '#d69e2e', // yellow
    '#805ad5', // purple
    '#319795', // teal
    '#dd6b20', // orange
    '#718096', // gray
];

// SVGs replacing Chakra Icons
const CloseIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const AddIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
);

const EditFlowModal = ({
    isOpen,
    onClose,
    flow,
    updateInfo,
}: EditFlowModalProps) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tagName, setTagName] = useState('');
    const [publish, setPublish] = useState(false);

    const [colorTag, setColorTag] = useState(COLORS[0]);
    const [tags, setTags] = useState<{ name: string; color: string }[]>([]);

    // Replaces Chakra useDisclosure for the color popover
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    useEffect(() => {
        if (!flow || !isOpen) return;
        setTitle(flow.title ?? '');
        setDescription(flow.description ?? '');
        setColorTag(COLORS[0]);
        // Note: If old flow tags used Chakra strings like "blue", they might look unstyled 
        // unless migrated, but new tags will use these hex codes properly.
        setTags([...(flow.tags ?? [])]);
        setPublish(!!flow.publish);
        setTagName('');
        setIsPickerOpen(false);
    }, [flow, isOpen]);

    if (!isOpen) return null;

    const normalizedTagName = tagName.trim().toUpperCase();

    const addTag = () => {
        if (!normalizedTagName) return;

        setTags((prev) => {
            const exists = prev.some((t) => t.name === normalizedTagName);
            if (exists) return prev;

            return [
                ...prev,
                {
                    name: normalizedTagName,
                    color: colorTag, // Now saving actual hex codes
                },
            ];
        });

        setTagName('');
    };

    const removeTagAt = (index: number) => {
        setTags((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (!title.trim() || !description.trim()) return;

        updateInfo({
            title: title.trim(),
            description: description.trim(),
            tags,
            publish,
        });

        onClose();
    };

    return (
        <div className={styles.overlay} onMouseDown={(e) => {
            // Close popover if clicking outside of it
            if (isPickerOpen) setIsPickerOpen(false);
        }}>
            <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>

                <div className={styles.header}>
                    <span>Edit Flow</span>
                    <button className={styles.closeIconBtn} onClick={onClose}>
                        <CloseIcon className={styles.icon} />
                    </button>
                </div>

                <div className={styles.body}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Title:</label>
                        <input
                            className={styles.input}
                            placeholder="Insert title..."
                            value={title}
                            onChange={(e) => setTitle(e.currentTarget.value)}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Description:</label>
                        <textarea
                            className={styles.textarea}
                            placeholder="Insert description..."
                            value={description}
                            onChange={(e) => setDescription(e.currentTarget.value)}
                        />
                    </div>

                    <label className={styles.label}>
                        Click on the tags to remove them (add using the input below):
                    </label>

                    <div className={styles.tagInputRow}>
                        {/* Color Picker Popover */}
                        <div className={styles.colorPickerWrapper}>
                            <button
                                type="button"
                                className={styles.colorBtn}
                                style={{ backgroundColor: colorTag }}
                                onClick={() => setIsPickerOpen(!isPickerOpen)}
                            />

                            {isPickerOpen && (
                                <div className={styles.colorDropdown}>
                                    <div className={styles.dropdownHeader}>Select Color</div>
                                    {COLORS.map((colorVal, id) => (
                                        <button
                                            key={id}
                                            type="button"
                                            className={styles.colorOption}
                                            style={{ backgroundColor: colorVal }}
                                            onClick={() => {
                                                setColorTag(colorVal);
                                                setIsPickerOpen(false);
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Tag Input */}
                        <input
                            className={styles.input}
                            style={{ width: '40%' }}
                            placeholder="Insert tag name..."
                            title="Press Enter↵ in the input box to add a tag"
                            value={tagName}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addTag();
                                }
                            }}
                            onChange={(e) => setTagName(e.currentTarget.value)}
                        />

                        {/* Add Tag Button */}
                        <button
                            type="button"
                            className={styles.addBtn}
                            disabled={!normalizedTagName}
                            onClick={addTag}
                            title="Add Tag"
                        >
                            <AddIcon className={styles.iconSmall} />
                        </button>
                    </div>

                    {/* Tags List */}
                    <div className={styles.tagsContainer}>
                        {tags.map((tag, id) => (
                            <button
                                key={`${tag.name}-${id}`}
                                className={styles.tagBtn}
                                onClick={() => removeTagAt(id)}
                                title="Remove tag"
                                type="button"
                            >
                                {/* Fallback to gray if the color is an old Chakra string instead of hex */}
                                <span className={styles.tag} style={{ backgroundColor: tag.color.includes('#') ? tag.color : '#718096' }}>
                                    <CloseIcon className={styles.iconSmall} />
                                    <span>{tag.name}</span>
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.footer}>
                    {/* Moved Publish toggle into the footer for cleaner layout than absolute positioning */}
                    <div className={styles.publishWrapper}>
                        {publish ? 'Published' : 'Not published'}:{' '}
                        <button
                            className={`${styles.publishBtn} ${publish ? styles.publishBtnOn : styles.publishBtnOff}`}
                            onClick={() => setPublish((p) => !p)}
                            title="Toggle publish"
                            type="button"
                        >
                            {publish ? <CheckIcon className={styles.iconSmall} /> : <CloseIcon className={styles.iconSmall} />}
                        </button>
                    </div>

                    <button className={styles.submitBtn} onClick={handleSubmit}>
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditFlowModal;