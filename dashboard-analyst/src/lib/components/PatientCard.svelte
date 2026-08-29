<script lang="ts">
	import type { Patient } from '$lib/types';

	let {
		patient,
		selectionMode = false,
		isSelected = false,
		onclick
	}: {
		patient: Patient;
		selectionMode?: boolean;
		isSelected?: boolean;
		onclick?: () => void;
	} = $props();
</script>

<button
	class="patient-card"
	class:selection-mode={selectionMode}
	class:selected={isSelected}
	{onclick}
>
	<div class="avatar">
		<!-- Safely grab the first letters -->
		{patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
	</div>

	<div class="info">
		<h3>{patient.firstName} {patient.lastName}</h3>
		<!-- Display the new patient data -->
		<p>
			{patient.gender} • {patient.age} anni
			{#if patient.degree?.label}
				<br /> 🎓 {patient.degree.label}
			{/if}
		</p>
	</div>

	{#if selectionMode}
		<div class="checkbox" class:checked={isSelected}>
			{#if isSelected}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="white"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg
				>
			{/if}
		</div>
	{/if}
</button>

<style>
	.patient-card {
		display: flex;
		align-items: center;
		width: 100%;
		background-color: white;
		border: 1px solid rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		padding: 16px;
		text-align: left;
		cursor: pointer;
		transition: all 0.2s;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
	}

	.patient-card:hover {
		border-color: rgba(0, 0, 0, 0.2);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
	}

	.patient-card.selection-mode {
		background-color: #fafafa;
	}

	.patient-card.selected {
		border-color: black;
		border-width: 2px;
		background-color: white;
	}

	.avatar {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background-color: #f4f6f8;
		color: black;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		font-size: 18px;
		margin-right: 16px;
		text-transform: uppercase;
	}

	.info h3 {
		margin: 0 0 4px 0;
		font-size: 16px;
		color: black;
	}

	.info p {
		margin: 0;
		font-size: 14px;
		color: #666;
		line-height: 1.4;
	}

	.checkbox {
		margin-left: auto;
		width: 24px;
		height: 24px;
		border-radius: 6px;
		border: 2px solid #ccc;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
	}

	.checkbox.checked {
		background-color: black;
		border-color: black;
	}
</style>
