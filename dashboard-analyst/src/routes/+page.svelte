<script lang="ts">
	import type { PageData } from './$types';
	import type { Stats } from '$lib/types';
	import DataCard from '$lib/components/DataCard.svelte';
	import LineChart from '$lib/components/LineChart.svelte';

	let { data }: { data: PageData } = $props();

	let stats: Stats = $derived(
		data.stats || {
			pazienti: 0,
			maschi: 0,
			femmine: 0,
			percorsi: 0,
			testTable: [],
			chartData: []
		}
	);

	let chartDatasets = $derived(
		data.chartDatasets || [
			{
				label: 'Media risposte corrette',
				data: stats.chartData
			}
		]
	);
</script>

<div class="home-container">
	<!-- Stat Cards Grid -->
	<div class="stats-grid">
		<DataCard icon="person" title="Pazienti" value={stats.pazienti} color="green" />
		<DataCard icon="male" title="Maschi" value={stats.maschi} color="blue" />
		<DataCard icon="female" title="Femmine" value={stats.femmine} color="pink" />
		<DataCard icon="route" title="Percorsi" value={stats.percorsi} color="orange" />
	</div>

	<!-- Data Table -->
	<div class="table-container">
		<table>
			<thead>
				<tr>
					<th>Node Type</th>
					<th>% superamento test pre-esercitazione</th>
					<th>% superamento test post-esercitazione</th>
					<th>Tempo medio di reazione</th>
					<th>Tempo medio di risposta</th>
					<th>Distanza media del mouse</th>
				</tr>
			</thead>
			<tbody>
				{#each stats.testTable as test: any}
					<tr>
						<td>{test.nodeType}</td>
						<td>{test.percentualePre.toFixed(1)}%</td>
						<td>{test.percentualePost.toFixed(1)}%</td>
						<td>{test.tempoMedio.toFixed(2)} ms</td>
						<td>{test.tempoRispostaMedio?.toFixed(2) ?? '0.00'} ms</td>
						<td>{test.distanzaMouseMedia?.toFixed(1) ?? '0.0'} cm</td>
					</tr>
				{/each}
				{#if stats.testTable.length === 0}
					<tr>
						<td colspan="6" class="empty-text">Nessun dato di test pre-post disponibile.</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>

	<!-- Chart -->
	{#if chartDatasets.length > 0}
		<div class="chart-container-wrapper">
			<LineChart
				datasets={chartDatasets}
				title="Andamento per Tipologia di Nodo"
				xAxisTitle="Sessioni / Run"
				yAxisTitle="Punteggio Medio (%)"
			/>
		</div>
	{/if}
</div>

<style>
	.home-container {
		display: flex;
		flex-direction: column;
		gap: 40px;
		max-width: 1100px;
		margin: 0 auto;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 24px;
		height: 140px;
	}

	.table-container {
		background: white;
		padding: 20px;
		border-radius: 16px;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
		border: 1px solid rgba(0, 0, 0, 0.08);
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th {
		background-color: white;
		color: black;
		text-align: left;
		padding: 12px;
		font-weight: bold;
		border-bottom: 2px solid #ddd;
	}

	td {
		padding: 12px;
		border-bottom: 1px solid #eee;
	}

	.empty-text {
		color: #888;
		font-style: italic;
		text-align: center;
	}

	.chart-container-wrapper {
		background: white;
		border-radius: 16px;
		padding: 12px;
		border: 1px solid rgba(0, 0, 0, 0.08);
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
	}
</style>
