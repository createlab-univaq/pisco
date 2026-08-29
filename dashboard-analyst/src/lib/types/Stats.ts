import type { ChartPoint } from "./ChartPoint";
import type { TestStat } from "./TestStat";

export interface Stats {
    pazienti: number;
    maschi: number;
    femmine: number;
    percorsi: number;
    testTable: TestStat[];
    chartData: ChartPoint[];
}