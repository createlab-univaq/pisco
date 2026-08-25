'use client';

import EnumField from '@/components/forms/EnumField';
import EdgeProperties from '../EdgeProperties';
import { PassFailEdge } from './types';
import { PolyglotEdgePropertiesProps } from '@/components/ElementMapping';

const PassFailEdgeProperties = ({ element: baseElement, onUpdateElement }: PolyglotEdgePropertiesProps) => {

    const element = baseElement as PassFailEdge;

    const handleDataChange = (field: string, value: string) => {
        const mergedData = { ...element.data, [field]: value };

        onUpdateElement({
            ...element,
            data: mergedData,
            // Sync to canvas!
            reactFlow: element.reactFlow ? {
                ...element.reactFlow,
                data: mergedData,
            } : undefined
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <EdgeProperties element={element} onUpdateElement={onUpdateElement} />

            <EnumField
                label="Condition"
                name="conditionKind"
                value={element.data?.conditionKind || 'pass'}
                onChange={(e) => handleDataChange('conditionKind', e.target.value)}
                options={
                    <>
                        <option value="pass">Pass</option>
                        <option value="fail">Fail</option>
                    </>
                }
            />
        </div>
    );
};

export default PassFailEdgeProperties;