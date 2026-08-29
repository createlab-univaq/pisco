export interface ChartPoint {
    x: string | number;
    y: number;
}

export interface TestStat {
    nomeTest: string;
    percentualePre: number;
    percentualePost: number;
    tempoMedio: number;
}

export interface Stats {
    pazienti: number;
    maschi: number;
    femmine: number;
    percorsi: number;
    testTable: TestStat[];
    chartData: ChartPoint[];
}