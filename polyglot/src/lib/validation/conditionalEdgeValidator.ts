import { PolyglotEdge } from "@/types/PolyglotEdge";
import { PolyglotNode } from "@/types/PolyglotNode";
import { NODE_TYPE } from "@/types/NodeType";

// Helper to calculate points for individual embedded items inside a Container node
function calculateEmbeddedItemMaxPoints(type: string, data: any): number {
    if (!data) return 0;
    switch (type) {
        case NODE_TYPE.EMOTION_ATTRIBUTION_EXERCISE_A:
        case NODE_TYPE.EMOTION_RECOGNITION_EXERCISE_A:
            return 1;

        case NODE_TYPE.EMOTION_ATTRIBUTION_EXERCISE_B:
            return Array.isArray(data.items) ? data.items.length : 0;

        case NODE_TYPE.FAUX_PAS_EXERCISE_A:
        case NODE_TYPE.THEORY_OF_MIND_EXERCISE_A: {
            if (!Array.isArray(data.quiz)) return 0;
            return data.quiz.reduce((acc: number, q: any) => acc + (Array.isArray(q.questions) ? q.questions.length : 0), 0);
        }

        case NODE_TYPE.SOCIAL_SITUATIONS_EXERCISE_A: {
            if (!Array.isArray(data.items)) return 0;
            return data.items.reduce((acc: number, item: any) => acc + (Array.isArray(item.sections) ? item.sections.length : 0), 0);
        }

        default:
            return 0;
    }
}

function calculateNodeMaxPoints(node: PolyglotNode): number {
    if (!node || !node.data) return 0;
    const data = node.data as any;

    switch (node.type) {
        case NODE_TYPE.TRUE_FALSE:
        case NODE_TYPE.EMOTION_ATTRIBUTION:
        case NODE_TYPE.EYES_TASK:
            return Array.isArray(data.questions) ? data.questions.length : 0;

        case NODE_TYPE.EMOTION_ATTRIBUTION_EXERCISE_A:
        case NODE_TYPE.EMOTION_RECOGNITION_EXERCISE_A:
            return 1;

        case NODE_TYPE.EMOTION_ATTRIBUTION_EXERCISE_B:
            return Array.isArray(data.items) ? data.items.length : 0;

        case NODE_TYPE.FAUX_PAS:
        case NODE_TYPE.FAUX_PAS_EXERCISE_A:
        case NODE_TYPE.THEORY_OF_MIND:
        case NODE_TYPE.THEORY_OF_MIND_EXERCISE_A: {
            if (!Array.isArray(data.quiz)) return 0;
            return data.quiz.reduce((acc: number, q: any) => acc + (Array.isArray(q.questions) ? q.questions.length : 0), 0);
        }

        case NODE_TYPE.SOCIAL_SITUATIONS:
        case NODE_TYPE.SOCIAL_SITUATIONS_EXERCISE_A: {
            if (!Array.isArray(data.items)) return 0;
            return data.items.reduce((acc: number, item: any) => acc + (Array.isArray(item.sections) ? item.sections.length : 0), 0);
        }

        case NODE_TYPE.CONTAINER: {
            if (!Array.isArray(data.sections)) return 0;
            let total = 0;
            data.sections.forEach((section: any) => {
                if (Array.isArray(section.items)) {
                    section.items.forEach((item: any) => {
                        total += calculateEmbeddedItemMaxPoints(item.type, item.data);
                    });
                }
            });
            return total;
        }

        default: {
            let total = 0;
            if (Array.isArray(data.questions)) total += data.questions.length;
            if (Array.isArray(data.risposteCorrette)) total += data.risposteCorrette.length;
            if (Array.isArray(data.items)) total += data.items.length;
            if (Array.isArray(data.quiz)) {
                data.quiz.forEach((item: any) => {
                    total += Array.isArray(item.questions) ? item.questions.length : 1;
                });
            }
            return total;
        }
    }
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