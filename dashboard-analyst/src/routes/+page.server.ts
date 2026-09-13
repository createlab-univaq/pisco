import { GAME_EXECUTIONS_PATH, POLYGLOT_PATHS_PATH, ANALYSTS_PATH } from '$lib/server/api-paths';
import { apiFetch } from '$lib/server/apiClient';
import type { PageServerLoad } from './$types';
import type { Stats, Patient, GameExecution, PolyglotPath, ChartPoint } from '$lib/types';

const publishedFlowsPath = `${POLYGLOT_PATHS_PATH}?published=true`;

export const load: PageServerLoad = async ({ fetch, locals }) => {
    const token = locals.token;

    const analystId = locals.analystId;
    const analystPatientsPath = `${ANALYSTS_PATH}/${analystId}/patients`;

    const [patientsRes, executionsSummaryRes, polyglotRes] = await Promise.all([
        apiFetch(fetch, analystPatientsPath, { token }),
        apiFetch(fetch, GAME_EXECUTIONS_PATH, { token }), // Returns summaries
        apiFetch(fetch, publishedFlowsPath, { token })
    ]);

    const patients = patientsRes.ok ? ((await patientsRes.json()) as Patient[]) : [];
    const polyglotPaths = polyglotRes.ok ? ((await polyglotRes.json()) as PolyglotPath[]) : [];

    // --- Fetch full details to get the 'nodes' array ---
    const executionsSummary = executionsSummaryRes.ok ? ((await executionsSummaryRes.json()) as GameExecution[]) : [];

    const executions = await Promise.all(
        executionsSummary.map(async (execSummary) => {
            const detailRes = await apiFetch(fetch, `${GAME_EXECUTIONS_PATH}/${execSummary.id}`, { token });
            if (detailRes.ok) {
                return (await detailRes.json()) as GameExecution;
            }
            return execSummary; // Fallback
        })
    );

    // Compute Basic Counts
    const pazienti = patients.length;
    const maschi = patients.filter((p) => p.gender === 'MASCHIO').length;
    const femmine = patients.filter((p) => p.gender === 'FEMMINA').length;
    const percorsi = polyglotPaths.length;

    // Compute Global Test Table (Pre-Post matching with flexible First vs Last logic)
    const testMap: Record<string, {
        preScores: number[];
        postScores: number[];
        reactionTimes: number[];
        responseTimes: number[];
        mouseDistances: number[]
    }> = {};

    executions.forEach((exec) => {
        const nodes = exec.nodes || [];

        // Group test nodes by their nodeType
        const nodesByType: Record<string, any[]> = {};
        nodes.forEach(n => {
            if (!n.isExercise) {
                if (!nodesByType[n.nodeType]) nodesByType[n.nodeType] = [];
                nodesByType[n.nodeType].push(n);
            }
        });

        // If a test was played at least twice in this run, consider First = Pre, Last = Post
        Object.keys(nodesByType).forEach(nodeType => {
            const instances = nodesByType[nodeType];

            if (instances.length >= 2) {
                const pre = instances[0]; // First time they played it
                const post = instances[instances.length - 1]; // Last time they played it

                if (!testMap[nodeType]) {
                    testMap[nodeType] = { preScores: [], postScores: [], reactionTimes: [], responseTimes: [], mouseDistances: [] };
                }

                testMap[nodeType].preScores.push(pre.percentageScore);
                testMap[nodeType].postScores.push(post.percentageScore);

                if (pre.averageReactionTimeInMilliseconds) testMap[nodeType].reactionTimes.push(pre.averageReactionTimeInMilliseconds);
                if (post.averageReactionTimeInMilliseconds) testMap[nodeType].reactionTimes.push(post.averageReactionTimeInMilliseconds);

                if (pre.averageResponseTimeInMilliseconds) testMap[nodeType].responseTimes.push(pre.averageResponseTimeInMilliseconds);
                if (post.averageResponseTimeInMilliseconds) testMap[nodeType].responseTimes.push(post.averageResponseTimeInMilliseconds);

                if (pre.averageMouseDistanceInCentimeters) testMap[nodeType].mouseDistances.push(pre.averageMouseDistanceInCentimeters);
                if (post.averageMouseDistanceInCentimeters) testMap[nodeType].mouseDistances.push(post.averageMouseDistanceInCentimeters);
            }
        });
    });

    const testTable = Object.keys(testMap).map((nodeType) => {
        const item = testMap[nodeType];
        const avgPre = item.preScores.length ? item.preScores.reduce((a, b) => a + b, 0) / item.preScores.length : 0;
        const avgPost = item.postScores.length ? item.postScores.reduce((a, b) => a + b, 0) / item.postScores.length : 0;
        const avgTime = item.reactionTimes.length ? item.reactionTimes.reduce((a, b) => a + b, 0) / item.reactionTimes.length : 0;
        const avgRespTime = item.responseTimes.length ? item.responseTimes.reduce((a, b) => a + b, 0) / item.responseTimes.length : 0;
        const avgMouseDist = item.mouseDistances.length ? item.mouseDistances.reduce((a, b) => a + b, 0) / item.mouseDistances.length : 0;

        return {
            nodeType,
            percentualePre: parseFloat(avgPre.toFixed(1)),
            percentualePost: parseFloat(avgPost.toFixed(1)),
            tempoMedio: parseFloat(avgTime.toFixed(1)),
            tempoRispostaMedio: parseFloat(avgRespTime.toFixed(1)),
            distanzaMouseMedia: parseFloat(avgMouseDist.toFixed(1))
        };
    });

    // 3. Compute Global Multi-Line Chart Datasets
    const nodeTypes = new Set<string>();
    executions.forEach((exec) => {
        (exec.nodes || []).forEach((n) => {
            if (!n.isExercise) nodeTypes.add(n.nodeType);
        });
    });

    const chartDatasets = Array.from(nodeTypes).map((type) => {
        const datasetData = executions.map((exec, idx) => {
            const nodesOfType = (exec.nodes || []).filter((n) => !n.isExercise && n.nodeType === type);
            const avgScore = nodesOfType.length > 0
                ? nodesOfType.reduce((sum, n) => sum + n.percentageScore, 0) / nodesOfType.length
                : 0;

            return {
                x: exec.runName || `Run ${idx + 1}`,
                y: parseFloat(avgScore.toFixed(1))
            };
        });

        return {
            label: type,
            data: datasetData
        };
    });

    const chartData: ChartPoint[] = executions.map((exec, idx) => {
        const testNodes = (exec.nodes || []).filter((n) => !n.isExercise);
        const avgRunScore = testNodes.length > 0
            ? testNodes.reduce((sum, n) => sum + n.percentageScore, 0) / testNodes.length
            : 0;
        return {
            x: exec.runName || `Sess. ${idx + 1}`,
            y: parseFloat(avgRunScore.toFixed(1))
        };
    });

    const stats: Stats = {
        pazienti,
        maschi,
        femmine,
        percorsi,
        testTable: testTable as any,
        chartData
    };

    return { stats, chartDatasets };
};