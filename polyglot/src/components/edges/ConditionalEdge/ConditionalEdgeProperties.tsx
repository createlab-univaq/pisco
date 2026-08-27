'use client';

import EnumField from '@/components/forms/EnumField';
import TextField from '@/components/forms/TextField';
import EdgeProperties from '../EdgeProperties';
import { ConditionalEdge } from './types';
import { useEdgeSync } from '@/hooks/useEdgeSync';
import { PolyglotEdgePropertiesProps } from '@/types/polyglot-elements/ElementMappingTypes';

// FIXED: Accept the universal props
const ConditionalEdgeProperties = ({ element: baseElement, onUpdateElement }: PolyglotEdgePropertiesProps) => {

    // FIXED: Cast it safely inside the component, just like you did for TrueFalseNode!
    const element = baseElement as ConditionalEdge;

    const { handleBaseChange, handleDataChange } = useEdgeSync(element, onUpdateElement);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                        value={element.data?.threshold?.toString() || '0'}
                        onChange={(e) => handleDataChange({ threshold: Number(e.target.value) })}
                    />
                </div>
            </div>
        </div>
    );
};

export default ConditionalEdgeProperties;