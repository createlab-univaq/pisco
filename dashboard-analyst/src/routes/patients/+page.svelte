<script lang="ts">
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import PatientCard from '$lib/components/PatientCard.svelte';
	import { exportAllPatientsExcel } from '$lib/utils/excelExport';
	import { toast } from '$lib/stores/toast.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let selectionMode = $state(false);
	let selectedIds = $state<string[]>([]);
	let includeName = $state(false);

	function toggleSelectionMode() {
		selectionMode = !selectionMode;
		if (!selectionMode) selectedIds = [];
	}

	function handlePatientClick(id: string) {
		if (selectionMode) {
			if (selectedIds.includes(id)) {
				selectedIds = selectedIds.filter((val) => val !== id);
			} else {
				selectedIds = [...selectedIds, id];
			}
		} else {
			goto(`/patients/${id}`);
		}
	}

	function handleExportAll() {
		exportAllPatientsExcel(data.patients, data.executions, data.diagnosesMap, includeName);
		toast.add('Tutti i dati dei pazienti esportati con successo', 'success');
	}
</script>

<div class="page-header">
	<h1>Elenco Pazienti</h1>

	<div class="actions">
		<!-- Global Excel Export -->
		<label class="privacy-checkbox">
			<input type="checkbox" bind:checked={includeName} />
			Includi nome e cognome
		</label>
		<button class="btn btn-secondary" onclick={handleExportAll}>
			📊 Esporta tutti i dati Excel
		</button>

		<button class="btn btn-primary" onclick={() => goto('/patients/new')}>
			+ Aggiungi paziente
		</button>

		{#if selectionMode}
			<form
				action="?/deletePatients"
				method="POST"
				use:enhance={() => {
					return async ({ update, result }) => {
						await update();
						if (result.type === 'success') {
							toast.add('Pazienti selezionati eliminati con successo', 'success');
							selectionMode = false;
							selectedIds = [];
						} else if (result.type === 'failure') {
							const errData = result.data as Record<string, any>;
							toast.add(errData?.error || 'Impossibile eliminare i pazienti selezionati', 'error');
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
		<div class="empty-state">Nessun paziente presente</div>
	{:else}
		<div class="patient-grid">
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
		flex-wrap: wrap;
		gap: 16px;
	}

	h1 {
		margin: 0;
		font-size: 24px;
	}

	.actions {
		display: flex;
		gap: 12px;
		align-items: center;
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
		transition: all 0.2s;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-primary {
		background-color: black;
		color: white;
	}

	.btn-secondary {
		background-color: white;
		color: black;
		border: 1px solid black;
	}

	.btn-danger {
		background-color: #d32f2f;
		color: white;
	}

	.error-banner {
		background-color: #fde8e8;
		color: #d32f2f;
		padding: 12px;
		border-radius: 8px;
		margin-bottom: 24px;
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
