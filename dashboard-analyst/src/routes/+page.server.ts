import { PATIENTS_PATH, GAME_EXECUTIONS_PATH, POLYGLOT_PATHS_PATH } from '$lib/server/api-paths';
import { apiFetch } from '$lib/server/apiClient';
import type { PageServerLoad } from './$types';
import type { Stats, Patient, GameExecution, PolyglotPath, ChartPoint } from '$lib/types';

export const load: PageServerLoad = async ({ fetch, locals }) => {
    const token = locals.token;

    const [patientsRes, executionsRes, polyglotRes] = await Promise.all([
        apiFetch(fetch, PATIENTS_PATH, { token }),
        apiFetch(fetch, GAME_EXECUTIONS_PATH, { token }),
        apiFetch(fetch, POLYGLOT_PATHS_PATH, { token })
    ]);

    const patients = patientsRes.ok ? ((await patientsRes.json()) as Patient[]) : [];
    const executions = executionsRes.ok ? ((await executionsRes.json()) as GameExecution[]) : [];
    const polyglotPaths = polyglotRes.ok ? ((await polyglotRes.json()) as PolyglotPath[]) : [];

    // 1. Compute Basic Counts
    const pazienti = patients.length;
    const maschi = patients.filter((p) => p.gender === 'MASCHIO').length;
    const femmine = patients.filter((p) => p.gender === 'FEMMINA').length;
    const percorsi = polyglotPaths.length;

    // 2. Compute Global Test Table (Pre-Post matching with Response Times and Mouse Distances)
    const testMap: Record<string, {
        preScores: number[];
        postScores: number[];
        reactionTimes: number[];
        responseTimes: number[];
        mouseDistances: number[]
    }> = {};

    executions.forEach((exec) => {
        const nodes = exec.nodes || [];
        for (let i = 0; i < nodes.length - 2; i++) {
            const pre = nodes[i];
            const ex = nodes[i + 1];
            const post = nodes[i + 2];

            if (!pre.isExercise && ex.isExercise && !post.isExercise && pre.nodeType === post.nodeType) {
                const name = pre.nodeType;
                if (!testMap[name]) {
                    testMap[name] = { preScores: [], postScores: [], reactionTimes: [], responseTimes: [], mouseDistances: [] };
                }
                testMap[name].preScores.push(pre.percentageScore * 100);
                testMap[name].postScores.push(post.percentageScore * 100);

                if (pre.averageReactionTimeInMilliseconds) testMap[name].reactionTimes.push(pre.averageReactionTimeInMilliseconds);
                if (post.averageReactionTimeInMilliseconds) testMap[name].reactionTimes.push(post.averageReactionTimeInMilliseconds);

                if (pre.averageResponseTimeInMilliseconds) testMap[name].responseTimes.push(pre.averageResponseTimeInMilliseconds);
                if (post.averageResponseTimeInMilliseconds) testMap[name].responseTimes.push(post.averageResponseTimeInMilliseconds);

                if (pre.averageMouseDistanceInCentimeters) testMap[name].mouseDistances.push(pre.averageMouseDistanceInCentimeters);
                if (post.averageMouseDistanceInCentimeters) testMap[name].mouseDistances.push(post.averageMouseDistanceInCentimeters);
            }
        }
    });

    const testTable = Object.keys(testMap).map((nomeTest) => {
        const item = testMap[nomeTest];
        const avgPre = item.preScores.length ? item.preScores.reduce((a, b) => a + b, 0) / item.preScores.length : 0;
        const avgPost = item.postScores.length ? item.postScores.reduce((a, b) => a + b, 0) / item.postScores.length : 0;
        const avgTime = item.reactionTimes.length ? item.reactionTimes.reduce((a, b) => a + b, 0) / item.reactionTimes.length : 0;
        const avgRespTime = item.responseTimes.length ? item.responseTimes.reduce((a, b) => a + b, 0) / item.responseTimes.length : 0;
        const avgMouseDist = item.mouseDistances.length ? item.mouseDistances.reduce((a, b) => a + b, 0) / item.mouseDistances.length : 0;

        return {
            nomeTest,
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
                ? nodesOfType.reduce((sum, n) => sum + (n.percentageScore * 100), 0) / nodesOfType.length
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
            ? testNodes.reduce((sum, n) => sum + (n.percentageScore * 100), 0) / testNodes.length
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