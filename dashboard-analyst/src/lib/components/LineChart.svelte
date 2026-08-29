<script lang="ts">
	import Chart from 'chart.js/auto';
	import type { Action } from 'svelte/action';

	// Defining the expected data structure based on your Flutter implementation
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

	// Svelte Action to initialize and manage the Chart.js instance
	const renderChart: Action<HTMLCanvasElement, ChartPoint[]> = (node, initialData) => {
		const chart = new Chart(node, {
			type: 'line',
			data: {
				labels: initialData.map((d) => d.x),
				datasets: [
					{
						label: title,
						data: initialData.map((d) => d.y),
						borderColor: '#2563eb', // A clean, professional blue
						backgroundColor: 'rgba(37, 99, 235, 0.1)', // Soft blue fill
						borderWidth: 2,
						tension: 0.3,
						fill: true,
						pointBackgroundColor: 'white', // White dots on the line
						pointBorderColor: '#2563eb'
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						title: { display: !!xAxisTitle, text: xAxisTitle },
						grid: { color: 'rgba(0,0,0,0.05)' } // Very faint grid lines
					},
					y: {
						title: { display: !!yAxisTitle, text: yAxisTitle },
						beginAtZero: true,
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
			// This runs whenever the 'data' prop changes
			update(newData) {
				chart.data.labels = newData.map((d) => d.x);
				chart.data.datasets[0].data = newData.map((d) => d.y);
				chart.update();
			},
			// Cleanup when the component is destroyed
			destroy() {
				chart.destroy();
			}
		};
	};
</script>

<div class="chart-container">
	<!-- Apply the action to the canvas element -->
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
