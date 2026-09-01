<script lang="ts">
    import Chart from 'chart.js/auto';
    import type { Action } from 'svelte/action';

    export type ChartDataset = {
        label: string;
        data: { x: string | number; y: number }[];
    };

    let {
        datasets,
        title,
        xAxisTitle = '',
        yAxisTitle = ''
    }: {
        datasets: ChartDataset[];
        title: string;
        xAxisTitle?: string;
        yAxisTitle?: string;
    } = $props();

    const colors = ['#2563eb', '#dc2626', '#16a34a', '#d97706', '#9333ea', '#0891b2'];

    const renderChart: Action<HTMLCanvasElement, ChartDataset[]> = (node, initialData) => {
        const chart = new Chart(node, {
            type: 'line',
            data: {
                labels: initialData.length > 0 ? initialData[0].data.map((d) => d.x) : [],
                datasets: initialData.map((ds, i) => ({
                    label: ds.label,
                    data: ds.data.map((d) => d.y),
                    borderColor: colors[i % colors.length],
                    backgroundColor: colors[i % colors.length] + '1A',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false,
                    pointBackgroundColor: 'white',
                    pointBorderColor: colors[i % colors.length]
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: { display: !!xAxisTitle, text: xAxisTitle },
                        grid: { color: 'rgba(0,0,0,0.05)' }
                    },
                    y: {
                        title: { display: !!yAxisTitle, text: yAxisTitle },
                        beginAtZero: true,
                        max: 100,
                        grid: { color: 'rgba(0,0,0,0.05)' }
                    }
                },
                plugins: {
                    legend: { display: true, position: 'bottom' },
                    title: { display: true, text: title, font: { size: 16 } }
                }
            }
        });

        return {
            update(newData) {
                chart.data.labels = newData.length > 0 ? newData[0].data.map((d) => d.x) : [];
                chart.data.datasets = newData.map((ds, i) => ({
                    label: ds.label,
                    data: ds.data.map((d) => d.y),
                    borderColor: colors[i % colors.length],
                    backgroundColor: colors[i % colors.length] + '1A',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false,
                    pointBackgroundColor: 'white',
                    pointBorderColor: colors[i % colors.length]
                }));
                chart.update();
            },
            destroy() {
                chart.destroy();
            }
        };
    };
</script>

<div class="chart-container">
    <canvas use:renderChart={datasets}></canvas>
</div>

<style>
    .chart-container {
        width: 100%;
        height: 400px;
        background-color: white;
        padding: 24px;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        border: 1px solid rgba(0, 0, 0, 0.05);
        box-sizing: border-box;
    }
</style>