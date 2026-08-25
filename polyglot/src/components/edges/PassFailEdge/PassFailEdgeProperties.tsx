'use client';

import { MarkerType } from 'reactflow';
import EnumField from '@/components/forms/EnumField';
import EdgeProperties from '../EdgeProperties';
import { PassFailEdge } from './types';
import { PolyglotEdgePropertiesProps } from '@/components/ElementMapping';
import { useEdgeSync } from '@/hooks/useEdgeSync';

const PassFailEdgeProperties = ({ element: baseElement, onUpdateElement }: PolyglotEdgePropertiesProps) => {
    const element = baseElement as PassFailEdge;
    const { handleBaseChange, handleDataChange } = useEdgeSync(element, onUpdateElement);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <EdgeProperties element={element} onUpdateElement={onUpdateElement} />

            <EnumField
                label="Condition"
                name="conditionKind"
                value={element.data?.conditionKind || 'pass'}
                onChange={(e) => {
                    const val = e.target.value;
                    const color = val === 'fail' ? '#e53e3e' : '#38a169';

                    // Update data and automatically configure the matching marker color
                    handleDataChange({
                        conditionKind: val,
                        markerEnd: {
                            type: MarkerType.ArrowClosed,
                            color: color,
                        },
                    });
                }}
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