import { PolyglotEdge } from "@/types/PolyglotEdge";
import { PolyglotNode } from "@/types/PolyglotNode";

function calculateNodeMaxPoints(node: PolyglotNode): number {
    if (!node || !node.data) return 0;
    const data = node.data as any;
    let total = 0;

    if (Array.isArray(data.questions)) total += data.questions.length;
    if (Array.isArray(data.risposteCorrette)) total += data.risposteCorrette.length;

    if (Array.isArray(data.quiz)) {
        data.quiz.forEach((item: any) => {
            total += 1;
            if (Array.isArray(item.questions)) total += item.questions.length;
        });
    }

    if (Array.isArray(data.items)) {
        data.items.forEach((item: any) => {
            total += 1;
            if (Array.isArray(item.questions)) total += item.questions.length;
            if (Array.isArray(item.sections)) {
                item.sections.forEach((sec: any) => {
                    if (Array.isArray(sec.items)) total += sec.items.length;
                });
            }
        });
    }

    if (Array.isArray(data.sections)) {
        data.sections.forEach((sec: any) => {
            if (Array.isArray(sec.items)) total += sec.items.length;
        });
    }

    return total > 0 ? total : 0;
}

export const validateConditionalEdges = (nodes: PolyglotNode[], edges: PolyglotEdge[]): string[] => {
    const errors: string[] = [];
    const nodeMap = new Map(nodes.map(n => [n._id || n.reactFlow?.id, n]));
    const edgesBySource = new Map<string, any[]>();

    edges.forEach((edge: any) => {
        const sourceId = edge.reactFlow?.source || edge.source;
        const edgeData = edge.reactFlow?.data || edge.data || {};

        if (edge.type === 'conditional' || edgeData?.operator || edge.reactFlow?.type === 'conditional') {
            const threshold = Number(edgeData.threshold);
            if (Number.isNaN(threshold)) return;

            if (!edgesBySource.has(sourceId)) {
                edgesBySource.set(sourceId, []);
            }
            edgesBySource.get(sourceId)!.push(edgeData);

            const sourceNode = nodeMap.get(sourceId);
            if (sourceNode) {
                const maxPoints = calculateNodeMaxPoints(sourceNode);

                if (threshold < 0) {
                    errors.push(`Conditional threshold cannot be less than 0.`);
                }

                if (maxPoints > 0 && threshold > maxPoints) {
                    errors.push(`Node "${sourceNode.title || sourceNode.type}" only has a maximum of ${maxPoints} points/questions, but a conditional edge requires threshold ${threshold}.`);
                }
            }
        }
    });

    edgesBySource.forEach((siblingEdges) => {
        const seenConditions = new Set<string>();
        siblingEdges.forEach((edgeData) => {
            const signature = `${edgeData.operator}_${edgeData.threshold}`;
            if (seenConditions.has(signature)) {
                errors.push(`Logical conflict: Multiple outgoing conditional paths from the same node share the exact same condition (${edgeData.operator} ${edgeData.threshold}).`);
            }
            seenConditions.add(signature);
        });
    });

    return errors;
};