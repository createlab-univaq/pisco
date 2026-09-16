import { PolyglotNode } from '@/types/PolyglotNode';
import { PolyglotEdge } from '@/types/PolyglotEdge';

export const validateEdgeIntegrity = (nodes: PolyglotNode[], edges: PolyglotEdge[]): string[] => {
    const errors: string[] = [];
    
    // Create a fast lookup Set of all valid node IDs currently in the flow
    const validNodeIds = new Set(nodes.map(n => n.reactFlow?.id || n._id));

    for (const edge of edges) {
        const sourceId = edge.reactFlow?.source;
        const targetId = edge.reactFlow?.target;

        // Safely check if source or target is missing from the node payload
        const isSourceMissing = sourceId && !validNodeIds.has(sourceId);
        const isTargetMissing = targetId && !validNodeIds.has(targetId);

        if (isSourceMissing || isTargetMissing) {
            const missingType = isSourceMissing ? 'Source' : 'Target';
            const missingId = isSourceMissing ? sourceId : targetId;
            
            errors.push(
                `Edge ID: "${edge._id}" connects to a non-existent ${missingType} node (Node ID: "${missingId}"). The fastest way to fix this is to remove this edge via the Code Editor.`
            );
        }
    }

    return errors;
};