<script lang="ts">
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import PatientCard from '$lib/components/PatientCard.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let selectionMode = $state(false);
	let selectedIds = $state<string[]>([]);

	function toggleSelectionMode() {
		selectionMode = !selectionMode;
		if (!selectionMode) {
			selectedIds = [];
		}
	}

	function handlePatientClick(id: string) {
		if (selectionMode) {
			if (selectedIds.includes(id)) {
				selectedIds = selectedIds.filter((val) => val !== id);
			} else {
				selectedIds = [...selectedIds, id];
			}
		} else {
			// Navigate to patient Dashboard[cite: 10]
			goto(`/patients/${id}`);
		}
	}
</script>

<div class="page-header">
	<h1>Elenco Pazienti</h1>

	<div class="actions">
		<!-- Add patient redirects to the new patient form -->
		<button class="btn btn-primary" onclick={() => goto('/patients/new')}>
			+ Aggiungi paziente
		</button>

		{#if selectionMode}
			<!-- FIXED: Action name matches the server -->
			<form
				action="?/deletePatients"
				method="POST"
				use:enhance={() => {
					return async ({ update, result }) => {
						await update();
						if (result.type === 'success') {
							selectionMode = false;
							selectedIds = [];
						}
					};
				}}
			>
				<input type="hidden" name="ids" value={JSON.stringify(selectedIds)} />
				<button type="submit" class="btn btn-danger" disabled={selectedIds.length === 0}>
					Elimina selezionati ({selectedIds.length})
				</button>
			</form>
		{/if}

		<!-- Toggle Selection Mode -->
		<button class="btn btn-secondary" onclick={toggleSelectionMode}>
			{selectionMode ? 'Annulla' : 'Elimina pazienti'}
		</button>
	</div>
</div>

{#if form?.error}
	<div class="error-banner">{form.error}</div>
{/if}

<div class="list-container">
	{#if data.patients.length === 0}
		<div class="empty-state">Nessun utente presente</div>
	{:else}
		<div class="patient-grid">
			<!-- Iterate over patients instead of utenti -->
			{#each data.patients as patient (patient.id)}
				<PatientCard
					{patient}
					{selectionMode}
					isSelected={selectedIds.includes(patient.id)}
					onclick={() => handlePatientClick(patient.id)}
				/>
			{/each}
		</div>
	{/if}
</div>

<style>
	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
	}

	h1 {
		margin: 0;
		font-size: 24px;
	}

	.actions {
		display: flex;
		gap: 12px;
		align-items: center;
	}

	.btn {
		padding: 10px 16px;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		border: none;
		transition: all 0.2s;
		font-size: 14px;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-primary {
		background-color: black;
		color: white;
	}

	.btn-primary:hover {
		background-color: #333;
	}

	.btn-secondary {
		background-color: white;
		color: black;
		border: 1px solid black;
	}

	.btn-secondary:hover {
		background-color: #f4f6f8;
	}

	.btn-danger {
		background-color: #d32f2f;
		color: white;
	}

	.btn-danger:hover {
		background-color: #b71c1c;
	}

	.error-banner {
		background-color: #fde8e8;
		color: #d32f2f;
		padding: 12px;
		border-radius: 8px;
		margin-bottom: 24px;
		font-weight: 500;
		text-align: center;
	}

	.list-container {
		max-width: 800px;
		margin: 0 auto;
	}

	.patient-grid {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.empty-state {
		text-align: center;
		padding: 48px;
		color: #666;
		font-size: 18px;
		background-color: white;
		border-radius: 12px;
		border: 1px dashed #ccc;
	}
</style>
