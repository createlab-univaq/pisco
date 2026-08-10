'use client';

import EnumField from '@/components/forms/EnumField';
import TextField from '@/components/forms/TextField';

export type NodePropertiesProps = {
    platform?: string[];
    activityDescription?: string;
};

const NodeProperties = ({
    platform = [''],
    activityDescription,
}: NodePropertiesProps) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Only render this block if an activity description exists */}
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
                isRequired // <-- FIXED: Changed from 'required' to 'isRequired'
            />

            <TextField
                label="Description"
                name="description"
                isTextArea
            />

            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>

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