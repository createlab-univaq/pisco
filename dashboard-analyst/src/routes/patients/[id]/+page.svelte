<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData, ActionData } from './$types';
	import LineChart from '$lib/components/LineChart.svelte';
	import BarChart from '$lib/components/BarChart.svelte';
	import { exportSinglePatientExcel } from '$lib/utils/excelExport';
	import { toast } from '$lib/stores/toast.svelte';
	import ConfirmModal from '$lib/components/ConfirmModal.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let patient = $derived(data.patient);
	let paths = $derived(data.paths);
	let diagnoses = $derived(data.diagnoses);
	let executions = $derived(data.executions);
	let polyglotPaths = $derived(data.polyglotPaths);
	let degrees = $derived(data.degrees);

	let includeName = $state(false);
	let gestionePercorsiMode = $state(false);
	let selectedPolyglotPathId = $state<string>('');
	let editPatientMode = $state(false);

	let showDiagnosisModal = $state(false);
	let diagnosisFormElement = $state<HTMLFormElement | null>(null);

	// 1. PATH SELECTION
	let availableCodes = $derived(
		Array.from(new Set(executions.map((e) => e.patientPath.uniqueCode)))
	);
	let selectedCode = $state<string>('');
	$effect(() => {
		if (availableCodes.length > 0 && !selectedCode) selectedCode = availableCodes[0];
	});

	let codeExecutions = $derived(
		executions.filter((e) => e.patientPath.uniqueCode === selectedCode)
	);

	// 2. RUN SELECTION
	let selectedRunId = $state<string>('');
	$effect(() => {
		if (
			codeExecutions.length > 0 &&
			(!selectedRunId || !codeExecutions.find((e) => e.id === selectedRunId))
		) {
			selectedRunId = codeExecutions[codeExecutions.length - 1].id;
		}
	});

	let activeSession = $derived(codeExecutions.find((e) => e.id === selectedRunId));

	// 3. TABLE DATA COMPUTATION (Based on Active Session)
	let testNodes = $derived(activeSession?.nodes.filter((n) => !n.isExercise) || []);
	let exerciseNodes = $derived(activeSession?.nodes.filter((n) => n.isExercise) || []);

	// Calculate Pre-Post link (Test -> Exercise -> Test of same type)
	let prePostGroups = $derived(() => {
		const groups = [];
		const nodes = activeSession?.nodes || [];
		for (let i = 0; i < nodes.length - 2; i++) {
			const pre = nodes[i];
			const ex = nodes[i + 1];
			const post = nodes[i + 2];
			if (!pre.isExercise && ex.isExercise && !post.isExercise && pre.nodeType === post.nodeType) {
				groups.push({ pre, ex, post });
			}
		}
		return groups;
	});

	// 4. MULTI-LINE CHART DATA (Cross-run for selected path)
	let lineChartDatasets = $derived(() => {
		if (codeExecutions.length === 0) return [];
		const types = new Set<string>();
		codeExecutions.forEach((e) =>
			e.nodes.forEach((n) => {
				if (!n.isExercise) types.add(n.nodeType);
			})
		);

		return Array.from(types).map((type) => {
			const datasetData = codeExecutions.map((exec, idx) => {
				const nodesOfType = exec.nodes.filter((n) => !n.isExercise && n.nodeType === type);
				const avgScore =
					nodesOfType.length > 0
						? nodesOfType.reduce((sum, n) => sum + n.percentageScore * 100, 0) / nodesOfType.length
						: 0;

				return { x: exec.runName || `Run ${idx + 1}`, y: parseFloat(avgScore.toFixed(1)) };
			});
			return { label: type, data: datasetData };
		});
	});

	// 5. BAR CHART DATA (Single run, cross-nodetype)
	let barChartData = $derived(() => {
		if (!activeSession) return [];
		const types = new Set<string>();
		testNodes.forEach((n) => types.add(n.nodeType));

		return Array.from(types).map((type) => {
			const nodesOfType = testNodes.filter((n) => n.nodeType === type);
			const avgScore =
				nodesOfType.length > 0
					? nodesOfType.reduce((sum, n) => sum + n.percentageScore * 100, 0) / nodesOfType.length
					: 0;
			return { x: type, y: parseFloat(avgScore.toFixed(1)) };
		});
	});

	function handleExportExcel() {
		exportSinglePatientExcel(patient, executions, diagnoses, includeName);
		toast.add('Report Excel scaricato con successo', 'success');
	}
</script>

<div class="dashboard-page">
	<div class="top-nav">
		<button class="back-btn" onclick={() => goto('/patients')}>← Torna all'elenco</button>
	</div>

	<!-- Header Section -->
	<div class="patient-card">
		{#if editPatientMode}
			<!-- EDIT MODE FORM -->
			<form action="?/editPatient" method="POST" class="edit-patient-form">
				<div class="edit-row">
					<div class="form-group">
						<label for="firstName">Nome</label>
						<input
							type="text"
							id="firstName"
							name="firstName"
							value={patient.firstName}
							required
							class="dropdown"
						/>
					</div>
					<div class="form-group">
						<label for="lastName">Cognome</label>
						<input
							type="text"
							id="lastName"
							name="lastName"
							value={patient.lastName}
							required
							class="dropdown"
						/>
					</div>
				</div>
				<div class="edit-row">
					<div class="form-group">
						<label for="gender">Sesso</label>
						<select name="gender" id="gender" class="dropdown" required>
							<option value="MASCHIO" selected={patient.gender === 'MASCHIO'}>Maschio</option>
							<option value="FEMMINA" selected={patient.gender === 'FEMMINA'}>Femmina</option>
						</select>
					</div>
					<div class="form-group">
						<label for="age">Età</label>
						<input
							type="number"
							id="age"
							name="age"
							value={patient.age}
							required
							class="dropdown"
						/>
					</div>
					<div class="form-group">
						<label for="degreeCode">Titolo di Studio</label>
						<select name="degreeCode" id="degreeCode" class="dropdown" required>
							{#each degrees as degree}
								<option value={degree.code} selected={patient.degree?.code === degree.code}>
									{degree.label}
								</option>
							{/each}
						</select>
					</div>
				</div>

				<div class="edit-actions">
					<button type="submit" class="btn btn-primary">Salva Modifiche</button>
					<button type="button" class="btn btn-secondary" onclick={() => (editPatientMode = false)}
						>Annulla</button
					>

					<div class="spacer"></div>

					<!-- Delete Button inside edit mode to prevent accidental clicks -->
					<button
						type="submit"
						formaction="?/deletePatient"
						class="btn btn-danger"
						onclick={(e) => {
							if (
								!confirm("Sei sicuro di voler eliminare questo paziente? L'azione è irreversibile.")
							)
								e.preventDefault();
						}}
					>
						Elimina Paziente
					</button>
				</div>
			</form>
		{:else}
			<!-- NORMAL VIEW MODE -->
			<div class="patient-header">
				<div>
					<h1>{patient.firstName} {patient.lastName}</h1>
					<p class="subtitle">{patient.gender} • {patient.age} anni • 🎓 {patient.degree?.label}</p>
				</div>
				<div class="export-controls">
					<button
						class="btn btn-secondary"
						style="border-color: #ddd;"
						onclick={() => (editPatientMode = true)}
					>
						✏️ Modifica Dati
					</button>

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
		{/if}

		{#if gestionePercorsiMode}
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
									<strong>{path.flow?.name || 'Percorso'}</strong>
									<span class="code-sub">Codice: {path.uniqueCode}</span>
									<span class="date">{new Date(path.assignedAt).toLocaleDateString()}</span>
								</div>
								{#if gestionePercorsiMode}
									<form action="?/deletePath" method="POST">
										<input type="hidden" name="pathId" value={path.id} />
										<button type="submit" class="btn-icon-delete" title="Rimuovi percorso">✕</button
										>
									</form>
								{/if}
							</div>
						{/each}
					</div>
				{/if}

				<!-- Quick Assign Form in Management Mode -->
				{#if gestionePercorsiMode}
					<form action="?/assignPath" method="POST" class="quick-assign-form">
						<h4>Assegna Nuovo Percorso</h4>
						<div class="assign-row">
							<select
								name="polyglotPathId"
								bind:value={selectedPolyglotPathId}
								class="dropdown"
								required
							>
								<option value="" disabled>-- Seleziona protocollo --</option>
								{#each polyglotPaths as pp}
									<option value={pp.id}>{pp.name}</option>
								{/each}
							</select>
							<button type="submit" class="btn btn-primary">Assegna</button>
						</div>
					</form>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Data Controls -->
	<div class="section-card controls-card">
		<h2>Seleziona Dati da Visualizzare</h2>
		<div class="selectors-row">
			<div class="selector-group">
				<label for="codeSelect">Codice Percorso:</label>
				<select id="codeSelect" bind:value={selectedCode} class="dropdown">
					{#if availableCodes.length === 0}
						<option value="">Nessun percorso giocato</option>
					{/if}
					{#each availableCodes as code}
						<option value={code}>{code}</option>
					{/each}
				</select>
			</div>

			<div class="selector-group">
				<label for="runSelect">Seleziona Run (Sessione):</label>
				<select
					id="runSelect"
					bind:value={selectedRunId}
					class="dropdown"
					disabled={codeExecutions.length === 0}
				>
					{#each codeExecutions as exec, i}
						<option value={exec.id}
							>{exec.runName || `Run ${i + 1}`} ({new Date(
								exec.startedAt
							).toLocaleDateString()})</option
						>
					{/each}
				</select>
			</div>
		</div>
	</div>

	{#if !activeSession}
		<div class="section-card">
			<p class="empty-text">Nessuna run disponibile per i filtri selezionati.</p>
		</div>
	{:else}
		<!-- 1. Test Nodes Table -->
		<div class="section-card">
			<h3 class="table-title">1. Tabella Nodi Test (Singoli)</h3>
			<div class="table-container">
				<table>
					<thead>
						<tr>
							<th>Nome Nodo</th>
							<th>Tipologia</th>
							<th>Punteggio (Grezzo)</th>
							<th>Punteggio (%)</th>
							<th>Tempo Reazione (ms)</th>
							<th>Tempo Risposta (ms)</th>
							<th>Distanza Mouse (cm)</th>
						</tr>
					</thead>
					<tbody>
						{#each testNodes as node}
							<tr>
								<td>{node.nodeName}</td>
								<td>{node.nodeType}</td>
								<td>{node.score.toFixed(1)} / {node.maxScore.toFixed(1)}</td>
								<td>{(node.percentageScore * 100).toFixed(1)}%</td>
								<td>{node.averageReactionTimeInMilliseconds.toFixed(0)} ms</td>
								<td>{node.averageResponseTimeInMilliseconds.toFixed(0)} ms</td>
								<td>{node.averageMouseDistanceInCentimeters.toFixed(1)} cm</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<!-- 2. Exercise Nodes Table -->
		<div class="section-card">
			<h3 class="table-title">2. Tabella Esercitazioni</h3>
			<div class="table-container">
				<table>
					<thead>
						<tr>
							<th>Nome Esercitazione</th>
							<th>Tipologia</th>
							<th>Punteggio (Grezzo)</th>
							<th>Punteggio (%)</th>
							<th>Tempo Reazione (ms)</th>
							<th>Tempo Risposta (ms)</th>
							<th>Distanza Mouse (cm)</th>
						</tr>
					</thead>
					<tbody>
						{#each exerciseNodes as node}
							<tr>
								<td>{node.nodeName}</td>
								<td>{node.nodeType}</td>
								<td>{node.score.toFixed(1)} / {node.maxScore.toFixed(1)}</td>
								<td>{(node.percentageScore * 100).toFixed(1)}%</td>
								<td>{node.averageReactionTimeInMilliseconds.toFixed(0)} ms</td>
								<td>{node.averageResponseTimeInMilliseconds.toFixed(0)} ms</td>
								<td>{node.averageMouseDistanceInCentimeters.toFixed(1)} cm</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<!-- 3. Pre-Post Table -->
		<div class="section-card">
			<h3 class="table-title">3. Tabella Confronto Pre-Post</h3>
			<div class="table-container">
				<table>
					<thead>
						<tr>
							<th>Esercitazione (Intermezzo)</th>
							<th>Tipologia Nodi (Pre/Post)</th>
							<th>Punteggio Grezzo (Pre - Post)</th>
							<th>Punteggio % (Pre - Post)</th>
							<th>Tempo Reazione (Pre - Post)</th>
							<th>Tempo Risposta (Pre - Post)</th>
							<th>Distanza Mouse (Pre - Post)</th>
						</tr>
					</thead>
					<tbody>
						{#each prePostGroups() as group}
							<tr>
								<td>{group.ex.nodeName}</td>
								<td>{group.pre.nodeType}</td>
								<td>
									{group.pre.score.toFixed(1)} - {group.post.score.toFixed(1)}
								</td>
								<td>
									<span class="badge-combo">
										{(group.pre.percentageScore * 100).toFixed(1)}% - {(
											group.post.percentageScore * 100
										).toFixed(1)}%
									</span>
								</td>
								<td>
									<span class="badge-combo">
										{group.pre.averageReactionTimeInMilliseconds.toFixed(0)}ms - {group.post.averageReactionTimeInMilliseconds.toFixed(
											0
										)}ms
									</span>
								</td>
								<td>
									<span class="badge-combo">
										{group.pre.averageResponseTimeInMilliseconds.toFixed(0)}ms - {group.post.averageResponseTimeInMilliseconds.toFixed(
											0
										)}ms
									</span>
								</td>
								<td>
									<span class="badge-combo">
										{group.pre.averageMouseDistanceInCentimeters.toFixed(1)}cm - {group.post.averageMouseDistanceInCentimeters.toFixed(
											1
										)}cm
									</span>
								</td>
							</tr>
						{/each}
						{#if prePostGroups().length === 0}
							<tr>
								<td colspan="7" class="empty-text">
									Nessun pattern Pre -> Esercitazione -> Post trovato in questa run.
								</td>
							</tr>
						{/if}
					</tbody>
				</table>
			</div>
		</div>

		<!-- Charts -->
		<div class="section-card">
			<h2>Andamento Storico per Percorso (Tutte le Run)</h2>
			<LineChart
				datasets={lineChartDatasets()}
				title={`Trend Punteggi - Percorso: ${selectedCode}`}
				xAxisTitle="Run"
				yAxisTitle="Punteggio Medio (%)"
			/>
		</div>

		<div class="section-card">
			<h2>Dettaglio Run Corrente ({activeSession.runName || 'Run'})</h2>
			<BarChart
				data={barChartData()}
				title="Punteggi per Tipologia di Nodo"
				xAxisTitle="Tipologia Nodo"
				yAxisTitle="Punteggio Medio (%)"
			/>
		</div>
	{/if}

	<!-- Diagnoses & Clinical Notes Section (At the bottom) -->
	<div class="section-card">
		<div class="section-header">
			<h3>Diagnosi e Note Cliniche</h3>
		</div>

		<div class="diagnoses-list">
			{#if diagnoses.length === 0}
				<p class="empty-text">Nessuna diagnosi registrata per questo paziente.</p>
			{:else}
				{#each diagnoses as diag}
					<div class="diagnosis-item">
						<div class="diag-meta">
							<span class="diag-date">{new Date(diag.diagnosisDate).toLocaleDateString()}</span>
							{#if diag.medications}<span class="diag-med">Farmaci: {diag.medications}</span>{/if}
						</div>
						<p class="diag-text"><strong>Diagnosi:</strong> {diag.diagnosisText}</p>
						{#if diag.notes}
							<p class="diag-notes"><strong>Note:</strong> {diag.notes}</p>
						{/if}
					</div>
				{/each}
			{/if}
		</div>

		<!-- Form to Add New Diagnosis -->
		<form
			action="?/addDiagnosis"
			method="POST"
			bind:this={diagnosisFormElement}
			class="diagnosis-form"
		>
			<div class="diagnosis-form-header">
				<h4>Registra Nuova Diagnosi</h4>
				<p class="form-subtitle">
					Compila i campi sottostanti per aggiungere una nuova valutazione clinica al dossier del
					paziente.
				</p>
			</div>

			<div class="form-grid">
				<div class="form-group span-2">
					<label for="diagnosisText">Testo Diagnosi <span class="required">*</span></label>
					<input
						type="text"
						id="diagnosisText"
						name="diagnosisText"
						required
						placeholder="Es. Ottimi progressi cognitivi, stabilità nei tempi di reazione..."
						class="dropdown"
					/>
				</div>
				<div class="form-group span-1">
					<label for="diagnosisDate">Data <span class="required">*</span></label>
					<input
						type="date"
						id="diagnosisDate"
						name="diagnosisDate"
						value={new Date().toISOString().slice(0, 10)}
						required
						class="dropdown"
					/>
				</div>
				<div class="form-group span-1">
					<label for="medications">Terapia Farmacologica</label>
					<input
						type="text"
						id="medications"
						name="medications"
						placeholder="Es. Nessuno / Vitamina B12..."
						class="dropdown"
					/>
				</div>
				<div class="form-group span-2">
					<label for="notes">Note Cliniche / Annotazioni</label>
					<textarea
						id="notes"
						name="notes"
						placeholder="Aggiungi eventuali osservazioni comportamentali o note di follow-up..."
						class="dropdown textarea-field"
						rows="3"></textarea>
				</div>
			</div>

			<div class="form-actions">
				<button
					type="button"
					class="btn btn-primary"
					onclick={() => {
						if (diagnosisFormElement?.checkValidity()) {
							showDiagnosisModal = true;
						} else {
							diagnosisFormElement?.reportValidity();
						}
					}}
				>
					Salva Diagnosi
				</button>
			</div>
		</form>
	</div>

	<ConfirmModal
		bind:isOpen={showDiagnosisModal}
		title="Conferma Inserimento Diagnosi"
		message="Attenzione: Una volta registrata, la diagnosi non potrà più essere rimossa o eliminata dal sistema. Confermi il salvataggio?"
		confirmText="Registra Diagnosi"
		onConfirm={() => {
			if (diagnosisFormElement) {
				toast.add('Diagnosi aggiunta con successo', 'success');
				diagnosisFormElement.submit();
			}
		}}
	/>
</div>

<style>
	.controls-card {
		background: #fdfdfd;
		border-left: 4px solid #111;
	}
	.selectors-row {
		display: flex;
		gap: 24px;
		flex-wrap: wrap;
		margin-top: 12px;
	}
	.selector-group {
		display: flex;
		flex-direction: column;
		gap: 6px;
		flex: 1;
	}
	.selector-group label {
		font-size: 13px;
		font-weight: 600;
		color: #555;
	}

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
	.section-header h3 {
		margin: 0 0 16px 0;
		font-size: 20px;
		color: #111;
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
	h2 {
		margin-top: 0;
		margin-bottom: 20px;
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
	.dropdown {
		padding: 10px 14px;
		border-radius: 8px;
		border: 1.5px solid #d1d5db;
		font-size: 14px;
		background: white;
		width: 100%;
		box-sizing: border-box;
		font-family: inherit;
		transition: border-color 0.2s;
	}
	.dropdown:focus {
		outline: none;
		border-color: black;
	}
	.textarea-field {
		resize: vertical;
		min-height: 80px;
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

	/* Diagnoses section styles */
	.diagnoses-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-bottom: 24px;
	}
	.diagnosis-item {
		background: #fdfdfd;
		border: 1px solid #e5e7eb;
		border-radius: 10px;
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 6px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
	}
	.diag-meta {
		display: flex;
		justify-content: space-between;
		font-size: 12px;
		color: #6b7280;
		font-weight: 500;
	}
	.diag-text,
	.diag-notes {
		margin: 0;
		font-size: 14px;
		color: #1f2937;
		line-height: 1.5;
	}

	/* Beautiful Form Styling */
	.diagnosis-form {
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 16px;
		margin-top: 16px;
	}
	.diagnosis-form-header h4 {
		margin: 0 0 4px 0;
		font-size: 16px;
		color: #111;
		font-weight: 600;
	}
	.form-subtitle {
		margin: 0;
		font-size: 13px;
		color: #6b7280;
	}
	.form-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
	}
	.form-group {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.form-group label {
		font-size: 13px;
		font-weight: 600;
		color: #374151;
	}
	.required {
		color: #d32f2f;
	}
	.span-2 {
		grid-column: span 2;
	}
	.span-1 {
		grid-column: span 1;
	}
	.form-actions {
		display: flex;
		justify-content: flex-end;
		margin-top: 4px;
	}

	/* Diagnostics form classes */
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
		font-size: 11px;
		color: #777;
		margin-top: 2px;
	}
	.path-badge .code-sub {
		display: block;
		font-size: 12px;
		color: #555;
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
	.quick-assign-form {
		margin-top: 16px;
		padding-top: 16px;
		border-top: 1px dashed #ddd;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.quick-assign-form h4 {
		margin: 0;
		font-size: 14px;
		color: #444;
	}
	.assign-row {
		display: flex;
		gap: 12px;
		align-items: center;
	}
	.assign-row select {
		flex: 1;
	}

	/* Editing form styles */
	.edit-patient-form {
		display: flex;
		flex-direction: column;
		gap: 16px;
		background: #fdfdfd;
		padding: 16px;
		border-radius: 8px;
		border: 1px solid #eee;
	}
	.edit-row {
		display: flex;
		gap: 16px;
	}
	.edit-row .form-group {
		flex: 1;
	}
	.edit-actions {
		display: flex;
		gap: 12px;
		margin-top: 8px;
		align-items: center;
	}
	.spacer {
		flex: 1;
	}
	.btn-danger {
		background-color: #d32f2f;
		color: white;
	}
	.btn-danger:hover {
		background-color: #b71c1c;
	}
</style>
