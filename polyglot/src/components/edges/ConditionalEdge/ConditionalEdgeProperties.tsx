'use client';

import EnumField from '@/components/forms/EnumField';
import TextField from '@/components/forms/TextField';
import EdgeProperties from '../EdgeProperties';
import { ConditionalEdge } from './types';
import { useEdgeSync } from '@/hooks/useEdgeSync';
import { PolyglotEdgePropertiesProps } from '@/types/ElementMappingTypes';
import { validateConditionalEdge } from './validate';

const ConditionalEdgeProperties = ({ element: baseElement, onUpdateElement }: PolyglotEdgePropertiesProps) => {
    const element = baseElement as ConditionalEdge;
    const { handleDataChange } = useEdgeSync(element, onUpdateElement);

    const validationErrors = validateConditionalEdge(element.data);
    const getFieldError = (path: string) => validationErrors.find(e => e.path === path)?.message;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <EdgeProperties element={element} onUpdateElement={onUpdateElement} />

            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                <div style={{ flex: 1 }}>
                    <EnumField
                        label="Operator"
                        name="operator"
                        value={element.data?.operator || '>='}
                        onChange={(e) => handleDataChange({ operator: e.target.value as any })}
                        options={
                            <>
                                <option value=">">&gt;</option>
                                <option value=">=">&gt;=</option>
                                <option value="<">&lt;</option>
                                <option value="<=">&lt;=</option>
                                <option value="==">==</option>
                            </>
                        }
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <TextField
                        label="Threshold"
                        name="threshold"
                        type="number"
                        value={element.data?.threshold?.toString() ?? '0'}
                        onChange={(e) => handleDataChange({ threshold: Number(e.target.value) })}
                        /* FIX: Connect the extracted error */
                        error={getFieldError('data.threshold')}
                    />
                </div>
            </div>
        </div>
    );
};

export default ConditionalEdgeProperties;