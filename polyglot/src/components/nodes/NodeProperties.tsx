'use client';

import EnumField from '@/components/forms/EnumField';
import TextField from '@/components/forms/TextField';

export type NodePropertiesProps = {
    platform?: string[];
    activityDescription?: string;
    // FIXED: Added controlled props so the parent can manage the state
    title?: string;
    description?: string;
    onUpdateTitle?: (val: string) => void;
    onUpdateDescription?: (val: string) => void;
};

const NodeProperties = ({
    platform = [''],
    activityDescription,
    title,
    description,
    onUpdateTitle,
    onUpdateDescription,
}: NodePropertiesProps) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {activityDescription && (
                <div>
                    <strong style={{ display: 'block', marginBottom: '0.25rem' }}>
                        Activity description
                    </strong>
                    <p style={{ margin: 0, color: '#4a5568' }}>{activityDescription}</p>
                </div>
            )}

            <TextField
                label="Title"
                name="title"
                value={title || ''}
                onChange={(e) => onUpdateTitle?.(e.target.value)}
                isRequired
            />

            <TextField
                label="Description"
                name="description"
                value={description || ''}
                onChange={(e) => onUpdateDescription?.(e.target.value)}
                isTextArea
            />

            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                {/* Note: EnumField will also eventually need value/onChange props! */}
                <div style={{ flex: 1 }}>
                    <EnumField
                        label="Difficulty"
                        name="difficulty"
                        hidden={true}
                        options={
                            <>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                            </>
                        }
                    />
                </div>

                <div style={{ flex: 1 }}>
                    <EnumField
                        label="Platform"
                        name="platform"
                        options={
                            <>
                                {platform.map((p) => (
                                    <option key={p} value={p}>
                                        {p}
                                    </option>
                                ))}
                            </>
                        }
                    />
                </div>

            </div>
        </div>
    );
};

export default NodeProperties;