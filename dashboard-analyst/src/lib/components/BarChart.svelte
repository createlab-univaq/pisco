<script lang="ts">
	import Chart from 'chart.js/auto';
	import type { Action } from 'svelte/action';

	type ChartPoint = { x: string | number; y: number };

	let {
		data,
		title,
		xAxisTitle = '',
		yAxisTitle = ''
	}: {
		data: ChartPoint[];
		title: string;
		xAxisTitle?: string;
		yAxisTitle?: string;
	} = $props();

	// Palette of distinct, professional colors
	const colors = [
		'#2563eb', // Blue
		'#dc2626', // Red
		'#16a34a', // Green
		'#d97706', // Orange
		'#9333ea', // Purple
		'#0891b2', // Cyan
		'#e11d48', // Rose
		'#4f46e5' // Indigo
	];

	const renderChart: Action<HTMLCanvasElement, ChartPoint[]> = (node, initialData) => {
		const chart = new Chart(node, {
			type: 'bar',
			data: {
				labels: initialData.map((d) => d.x),
				datasets: [
					{
						label: 'Punteggio Medio %',
						data: initialData.map((d) => d.y),
						// Assign a different color to each bar based on its index
						backgroundColor: initialData.map((_, i) => colors[i % colors.length]),
						borderRadius: 4
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						title: { display: !!xAxisTitle, text: xAxisTitle },
						grid: { display: false }
					},
					y: {
						title: { display: !!yAxisTitle, text: yAxisTitle },
						beginAtZero: true,
						max: 100,
						grid: { color: 'rgba(0,0,0,0.05)' }
					}
				},
				plugins: {
					legend: { display: false },
					title: { display: true, text: title, font: { size: 16 } }
				}
			}
		});

		return {
			update(newData) {
				chart.data.labels = newData.map((d) => d.x);
				chart.data.datasets[0].data = newData.map((d) => d.y);
				// Update the colors dynamically if the amount of data changes
				chart.data.datasets[0].backgroundColor = newData.map((_, i) => colors[i % colors.length]);
				chart.update();
			},
			destroy() {
				chart.destroy();
			}
		};
	};
</script>

<div class="chart-container">
	<canvas use:renderChart={data}></canvas>
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
