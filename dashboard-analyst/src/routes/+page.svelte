<script lang="ts">
	import type { PageData } from './$types';
	import type { Stats } from '$lib/types';
	import DataCard from '$lib/components/DataCard.svelte';
	import LineChart from '$lib/components/LineChart.svelte';

	let { data }: { data: PageData } = $props();

	// The $derived rune ensures 'stats' stays in sync if 'data' ever updates!
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
					<th>Nome Test</th>
					<th>% superamento test pre-esercitazione</th>
					<th>% superamento test post-esercitazione</th>
					<th>Tempo medio di reazione</th>
				</tr>
			</thead>
			<tbody>
				{#each stats.testTable as test}
					<tr>
						<td>{test.nomeTest}</td>
						<td>{test.percentualePre.toFixed(1)}%</td>
						<td>{test.percentualePost.toFixed(1)}%</td>
						<td>{test.tempoMedio.toFixed(2)} ms</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Chart -->
	{#if stats.chartData.length > 0}
		<div class="chart-container">
			<LineChart data={stats.chartData} title="Media risposte corrette per test" />
		</div>
	{/if}
</div>

<style>
	.home-container {
		display: flex;
		flex-direction: column;
		gap: 40px;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 24px;
		height: 160px;
	}

	.table-container {
		background: white;
		padding: 20px;
		border-radius: 16px;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th {
		background-color: white; /* Changed from black */
		color: black; /* Changed from white */
		text-align: left;
		padding: 12px;
		font-weight: bold;
		border-bottom: 2px solid #ddd; /* Slightly thicker border for the header */
	}

	td {
		padding: 12px;
		border-bottom: 1px solid #eee;
	}
</style>
