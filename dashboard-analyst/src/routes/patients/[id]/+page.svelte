<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { PageData, ActionData } from './$types';
	import LineChart from '$lib/components/LineChart.svelte';
	import { exportSinglePatientExcel } from '$lib/utils/excelExport';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let patient = $derived(data.patient);
	let paths = $derived(data.paths);
	let diagnoses = $derived(data.diagnoses);
	let executions = $derived(data.executions);

	let includeName = $state(false);
	let gestionePercorsiMode = $state(false);

	// Filter node names for line chart dropdown
	let availableTestTypes = $derived(() => {
		const types = new Set<string>();
		executions.forEach((e) => {
			e.answers.forEach((a) => {
				const name = a.nodeName || a.nodeType?.label;
				if (name) types.add(name);
			});
		});
		return Array.from(types);
	});

	let selectedTestType = $state<string>('');

	$effect(() => {
		const types = availableTestTypes();
		if (types.length > 0 && !selectedTestType) {
			selectedTestType = types[0];
		}
	});

	let lineChartData = $derived(() => {
		if (!selectedTestType) return [];
		return executions
			.map((exec, idx) => {
				const match = exec.answers.find(
					(a) => (a.nodeName || a.nodeType?.label) === selectedTestType
				);
				if (!match) return null;
				const scorePct = match.maxScore > 0 ? (match.score / match.maxScore) * 100 : 0;
				return { x: `Sess. ${idx + 1}`, y: parseFloat(scorePct.toFixed(1)) };
			})
			.filter((p): p is { x: string; y: number } => p !== null);
	});

	let selectedSessionId = $state<string>('');

	$effect(() => {
		if (executions.length > 0 && !selectedSessionId) {
			selectedSessionId = executions[executions.length - 1].id;
		}
	});

	let activeSession = $derived(executions.find((e) => e.id === selectedSessionId));

	function handleExportExcel() {
		exportSinglePatientExcel(patient, executions, includeName);
	}
</script>

<div class="dashboard-page">
	<div class="top-nav">
		<button class="back-btn" onclick={() => goto('/patients')}>← Torna all'elenco</button>
	</div>

	<!-- Header Section -->
	<div class="patient-card">
		<div class="patient-header">
			<div>
				<h1>{patient.firstName} {patient.lastName}</h1>
				<p class="subtitle">{patient.gender} • {patient.age} anni • 🎓 {patient.degree?.label}</p>
			</div>
			<div class="export-controls">
				<label class="privacy-checkbox">
					<input type="checkbox" bind:checked={includeName} />
					Includi nome e cognome
				</label>
				<button class="btn btn-primary" onclick={handleExportExcel}>
					📊 Scarica report Excel
				</button>
				<button
					class="btn btn-secondary"
					onclick={() => (gestionePercorsiMode = !gestionePercorsiMode)}
				>
					{gestionePercorsiMode ? 'Chiudi gestione' : 'Gestione percorsi'}
				</button>
			</div>
		</div>

		<!-- Assigned Paths Sub-section -->
		<div class="paths-section">
			<h3>Percorsi Assegnati</h3>
			{#if paths.length === 0}
				<p class="empty-text">Nessun percorso assegnato al paziente.</p>
			{:else}
				<div class="paths-grid">
					{#each paths as path}
						<div class="path-badge">
							<div>
								<strong>Codice: {path.uniqueCode}</strong>
								<span class="date">{new Date(path.assignedAt).toLocaleDateString()}</span>
							</div>
							{#if gestionePercorsiMode}
								<form action="?/deletePath" method="POST" use:enhance>
									<input type="hidden" name="pathId" value={path.id} />
									<button type="submit" class="btn-icon-delete" title="Rimuovi percorso">✕</button>
								</form>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	{#if form?.error}
		<div class="error-banner">{form.error}</div>
	{/if}

	<!-- Session Selection & Tables -->
	<div class="section-card">
		<div class="session-selector-bar">
			<h2>Sessione di Gioco</h2>
			{#if executions.length > 0}
				<select bind:value={selectedSessionId} class="dropdown">
					{#each executions as exec, index}
						<option value={exec.id}>
							Sessione {index + 1} ({new Date(exec.startedAt).toLocaleString()})
						</option>
					{/each}
				</select>
			{/if}
		</div>

		{#if !activeSession}
			<p class="empty-text">Nessuna sessione di gioco registrata per questo paziente.</p>
		{:else}
			<!-- Test Table -->
			<h3 class="table-title">Tabella Test</h3>
			<div class="table-container">
				<table>
					<thead>
						<tr>
							<th>Nome Test</th>
							<th>Punteggio Grezzo</th>
							<th>Risultato %</th>
							<th>Colonna Combinata Pre/Post</th>
							<th>Tempo Reazione (ms)</th>
							<th>Tempo Totale (ms)</th>
							<th>Distanza Mouse (px)</th>
						</tr>
					</thead>
					<tbody>
						{#each activeSession.answers.filter((a) => a.category === 'TEST' || !a.category) as ans}
							<tr>
								<td>{ans.nodeName || ans.nodeType?.label}</td>
								<td>{ans.score} / {ans.maxScore}</td>
								<td>{ans.maxScore > 0 ? ((ans.score / ans.maxScore) * 100).toFixed(1) : 0}%</td>
								<td>
									<span class="badge-combo">
										[{ans.phase === 'PRE'
											? `${((ans.score / ans.maxScore) * 100).toFixed(0)}%`
											: '-'} |
										{ans.phase === 'POST'
											? `${((ans.score / ans.maxScore) * 100).toFixed(0)}%`
											: '-'}]
									</span>
								</td>
								<td>{ans.reactionTimeMs} ms</td>
								<td>{ans.totalResponseTimeMs ?? ans.reactionTimeMs} ms</td>
								<td>{ans.mouseDistancePx} px</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Esercitazioni Table -->
			<h3 class="table-title" style="margin-top: 32px;">Tabella Esercitazioni</h3>
			<div class="table-container">
				<table>
					<thead>
						<tr>
							<th>Nome Esercitazione</th>
							<th>Punteggio Grezzo</th>
							<th>Risultato %</th>
							<th>Tempo Reazione (ms)</th>
							<th>Tempo Totale (ms)</th>
							<th>Distanza Mouse (px)</th>
						</tr>
					</thead>
					<tbody>
						{#each activeSession.answers.filter((a) => a.category === 'ESERCITAZIONE') as ans}
							<tr>
								<td>{ans.nodeName || ans.nodeType?.label}</td>
								<td>{ans.score} / {ans.maxScore}</td>
								<td>{ans.maxScore > 0 ? ((ans.score / ans.maxScore) * 100).toFixed(1) : 0}%</td>
								<td>{ans.reactionTimeMs} ms</td>
								<td>{ans.totalResponseTimeMs ?? ans.reactionTimeMs} ms</td>
								<td>{ans.mouseDistancePx} px</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>

	<!-- Charts Section -->
	<div class="section-card">
		<div class="chart-header">
			<h2>Andamento nel Tempo per Tipologia di Test</h2>
			{#if availableTestTypes().length > 0}
				<select bind:value={selectedTestType} class="dropdown">
					{#each availableTestTypes() as type}
						<option value={type}>{type}</option>
					{/each}
				</select>
			{/if}
		</div>

		{#if lineChartData().length > 0}
			<LineChart
				data={lineChartData()}
				title="Punteggio % su Sessioni"
				xAxisTitle="Sessioni di Gioco"
				yAxisTitle="Punteggio (%)"
			/>
		{:else}
			<p class="empty-text">Nessun dato temporale sufficiente per il grafico.</p>
		{/if}
	</div>

	<!-- Diagnosis Section -->
	<div class="section-card">
		<h2>Sezione Diagnosi</h2>
		<div class="diagnoses-list">
			{#each diagnoses as diag}
				<div class="diagnosis-item">
					<div class="diag-header">
						<strong>Data: {new Date(diag.diagnosisDate).toLocaleDateString()}</strong>
					</div>
					<p class="diag-text">{diag.diagnosisText}</p>
					{#if diag.medications}<p class="diag-meta">
							<strong>Farmaci:</strong>
							{diag.medications}
						</p>{/if}
					{#if diag.notes}<p class="diag-meta"><strong>Note:</strong> {diag.notes}</p>{/if}
				</div>
			{/each}
		</div>

		<form action="?/addDiagnosis" method="POST" use:enhance class="diag-form">
			<h3>Aggiungi Nuova Diagnosi</h3>
			<textarea name="diagnosisText" placeholder="Testo della diagnosi..." required rows="3"
			></textarea>
			<div class="form-row">
				<input type="text" name="medications" placeholder="Farmaci prescritti (opzionale)" />
				<input type="text" name="notes" placeholder="Note aggiuntive (opzionale)" />
			</div>
			<button type="submit" class="btn btn-primary" style="align-self: flex-start;"
				>Salva Diagnosi</button
			>
		</form>
	</div>
</div>

<style>
	.dashboard-page {
		display: flex;
		flex-direction: column;
		gap: 24px;
		max-width: 1100px;
		margin: 0 auto;
	}

	.back-btn {
		background: none;
		border: none;
		font-size: 15px;
		font-weight: 600;
		cursor: pointer;
		color: #555;
	}

	.patient-card,
	.section-card {
		background: white;
		border-radius: 12px;
		padding: 24px;
		border: 1px solid rgba(0, 0, 0, 0.08);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
	}

	.patient-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		flex-wrap: wrap;
		gap: 16px;
	}

	h1 {
		margin: 0 0 6px 0;
		font-size: 26px;
	}

	.subtitle {
		margin: 0;
		color: #666;
		font-size: 15px;
	}

	.export-controls {
		display: flex;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
	}

	.privacy-checkbox {
		font-size: 14px;
		color: #444;
		display: flex;
		align-items: center;
		gap: 6px;
		cursor: pointer;
	}

	.btn {
		padding: 10px 16px;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		border: none;
		font-size: 14px;
		transition: opacity 0.2s;
	}

	.btn-primary {
		background-color: black;
		color: white;
	}

	.btn-secondary {
		background-color: white;
		color: black;
		border: 1.5px solid black;
	}

	.paths-section {
		margin-top: 20px;
		padding-top: 16px;
		border-top: 1px solid #eee;
	}

	.paths-section h3 {
		margin: 0 0 12px 0;
		font-size: 16px;
	}

	.paths-grid {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
	}

	.path-badge {
		background: #f8f9fa;
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 8px 12px;
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.path-badge .date {
		display: block;
		font-size: 12px;
		color: #777;
	}

	.btn-icon-delete {
		background: #ff4d4f;
		color: white;
		border: none;
		border-radius: 50%;
		width: 22px;
		height: 22px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		font-size: 12px;
	}

	.session-selector-bar,
	.chart-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}

	.dropdown {
		padding: 8px 12px;
		border-radius: 8px;
		border: 1.5px solid #ccc;
		font-size: 14px;
		background: white;
	}

	.table-title {
		margin: 0 0 12px 0;
		font-size: 17px;
	}

	.table-container {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th {
		background: #fafafa;
		text-align: left;
		padding: 10px;
		font-size: 13px;
		border-bottom: 2px solid #eee;
	}

	td {
		padding: 10px;
		font-size: 14px;
		border-bottom: 1px solid #f0f0f0;
	}

	.badge-combo {
		font-family: monospace;
		background: #f0f0f0;
		padding: 4px 8px;
		border-radius: 4px;
	}

	.empty-text {
		color: #888;
		font-style: italic;
	}

	.diagnoses-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-bottom: 24px;
	}

	.diagnosis-item {
		background: #fafafa;
		border-radius: 8px;
		padding: 12px 16px;
		border: 1px solid #eee;
	}

	.diag-header {
		font-size: 13px;
		color: #666;
		margin-bottom: 4px;
	}

	.diag-text {
		margin: 4px 0;
		font-size: 15px;
	}

	.diag-meta {
		margin: 4px 0 0 0;
		font-size: 13px;
		color: #555;
	}

	.diag-form {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-top: 16px;
		border-top: 1px solid #eee;
		padding-top: 16px;
	}

	textarea,
	input[type='text'] {
		padding: 10px 14px;
		border-radius: 8px;
		border: 1.5px solid #ccc;
		font-family: inherit;
		font-size: 14px;
	}

	.form-row {
		display: flex;
		gap: 12px;
	}

	.form-row input {
		flex: 1;
	}

	.error-banner {
		background-color: #fde8e8;
		color: #c81e1e;
		padding: 12px;
		border-radius: 8px;
		text-align: center;
	}
</style>
