<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let polyglotPaths = $derived(data.polyglotPaths);
	let patients = $derived(data.patients);

	let selectedPathId = $state<string>('');
	let selectedPatientId = $state<string>('');
</script>

<div class="paths-page">
	<div class="header-section">
		<h1>Gestione e Assegnazione Percorsi</h1>
		<p class="subtitle">
			Esplora i percorsi neurocognitivi disponibili e assegnali ai pazienti registrati.
		</p>
	</div>

	{#if form?.error}
		<div class="error-banner">{form.error}</div>
	{/if}

	{#if form?.success}
		<div class="success-banner">Percorso assegnato con successo!</div>
	{/if}

	<div class="content-grid">
		<!-- Available Polyglot Paths List -->
		<div class="section-card">
			<h2>Percorsi</h2>
			{#if polyglotPaths.length === 0}
				<p class="empty-text">Nessun percorso trovato.</p>
			{:else}
				<div class="card-list">
					{#each polyglotPaths as path}
						<div class="path-item">
							<div>
								<h3>{path.name}</h3>
								<p>{path.description}</p>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Assignment Form Section -->
		<div class="section-card assignment-card">
			<h2>Assegna Percorso a Paziente</h2>
			<form action="?/assignPath" method="POST" use:enhance class="assignment-form">
				<div class="form-group">
					<label for="polyglotPathId">Seleziona Percorso</label>
					<select
						id="polyglotPathId"
						name="polyglotPathId"
						bind:value={selectedPathId}
						class="dropdown"
						required
					>
						<option value="" disabled>-- Scegli percorso --</option>
						{#each polyglotPaths as path}
							<option value={path.id}>{path.name}</option>
						{/each}
					</select>
				</div>

				<div class="form-group">
					<label for="patientId">Seleziona Paziente</label>
					<select
						id="patientId"
						name="patientId"
						bind:value={selectedPatientId}
						class="dropdown"
						required
					>
						<option value="" disabled>-- Scegli paziente --</option>
						{#each patients as patient}
							<option value={patient.id}
								>{patient.firstName}
								{patient.lastName} ({patient.gender}, {patient.age} anni)</option
							>
						{/each}
					</select>
				</div>

				<button type="submit" class="btn btn-primary">Assegna Percorso</button>
			</form>
		</div>
	</div>
</div>

<style>
	.paths-page {
		display: flex;
		flex-direction: column;
		gap: 24px;
		max-width: 1100px;
		margin: 0 auto;
	}

	.header-section h1 {
		margin: 0 0 6px 0;
		font-size: 26px;
	}

	.subtitle {
		margin: 0;
		color: #666;
		font-size: 15px;
	}

	.content-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px;
	}

	@media (max-width: 768px) {
		.content-grid {
			grid-template-columns: 1fr;
		}
	}

	.section-card {
		background: white;
		border-radius: 12px;
		padding: 24px;
		border: 1px solid rgba(0, 0, 0, 0.08);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
	}

	.section-card h2 {
		margin-top: 0;
		font-size: 18px;
		margin-bottom: 16px;
		border-bottom: 1px solid #eee;
		padding-bottom: 12px;
	}

	.card-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.path-item {
		background: #fcfcfc;
		border: 1px solid #eaeaea;
		border-radius: 8px;
		padding: 16px;
	}

	.path-item h3 {
		margin: 0 0 6px 0;
		font-size: 16px;
	}

	.path-item p {
		margin: 0;
		font-size: 13px;
		color: #666;
	}

	.assignment-form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	label {
		font-size: 13px;
		font-weight: 600;
		color: #444;
	}

	.dropdown {
		padding: 10px 12px;
		border-radius: 8px;
		border: 1.5px solid #ccc;
		font-size: 14px;
		background: white;
	}

	.btn {
		padding: 12px 16px;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		border: none;
		font-size: 14px;
		transition: opacity 0.2s;
		margin-top: 8px;
	}

	.btn-primary {
		background-color: black;
		color: white;
	}

	.error-banner {
		background-color: #fde8e8;
		color: #c81e1e;
		padding: 12px;
		border-radius: 8px;
		text-align: center;
	}

	.success-banner {
		background-color: #def7ec;
		color: #03543f;
		padding: 12px;
		border-radius: 8px;
		text-align: center;
	}

	.empty-text {
		color: #888;
		font-style: italic;
	}
</style>
