<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { PageData, ActionData } from './$types';
	import { toast } from '$lib/stores/toast.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<div class="page-header">
	<button class="back-btn" onclick={() => goto('/patients')}> ← Torna alla lista </button>
</div>

<div class="form-wrapper">
	<div class="form-container">
		<h1>Registrazione nuovo paziente</h1>

		<form
			method="POST"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result.type === 'success' || result.type === 'redirect') {
						toast.add('Paziente registrato con successo', 'success');
					} else if (result.type === 'failure') {
						const errData = result.data as Record<string, any>;
						toast.add(
							errData?.globalError || 'Errore durante la registrazione del paziente',
							'error'
						);
					}
					await update();
				};
			}}
		>
			<div class="input-row">
				<div class="input-group">
					<label for="firstName">Nome</label>
					<input
						type="text"
						id="firstName"
						name="firstName"
						value={form?.values?.firstName ?? ''}
						class:error={form?.fieldErrors?.firstName}
						required
					/>
					{#if form?.fieldErrors?.firstName}
						<span class="field-error">{form.fieldErrors.firstName}</span>
					{/if}
				</div>

				<div class="input-group">
					<label for="lastName">Cognome</label>
					<input
						type="text"
						id="lastName"
						name="lastName"
						value={form?.values?.lastName ?? ''}
						class:error={form?.fieldErrors?.lastName}
						required
					/>
					{#if form?.fieldErrors?.lastName}
						<span class="field-error">{form.fieldErrors.lastName}</span>
					{/if}
				</div>
			</div>

			<div class="input-row">
				<div class="input-group">
					<label for="gender">Sesso</label>
					<select name="gender" id="gender" class:error={form?.fieldErrors?.gender} required>
						<option value="" disabled selected={!form?.values?.gender}>Seleziona sesso</option>
						<option value="MASCHIO" selected={form?.values?.gender === 'MASCHIO'}>Maschio</option>
						<option value="FEMMINA" selected={form?.values?.gender === 'FEMMINA'}>Femmina</option>
					</select>
					{#if form?.fieldErrors?.gender}
						<span class="field-error">{form.fieldErrors.gender}</span>
					{/if}
				</div>

				<div class="input-group">
					<label for="age">Età</label>
					<input
						type="number"
						id="age"
						name="age"
						min="0"
						max="120"
						value={form?.values?.age ?? ''}
						class:error={form?.fieldErrors?.age}
						required
					/>
					{#if form?.fieldErrors?.age}
						<span class="field-error">{form.fieldErrors.age}</span>
					{/if}
				</div>
			</div>

			<div class="input-group">
				<label for="degreeCode">Titolo di Studio</label>
				<select
					name="degreeCode"
					id="degreeCode"
					class:error={form?.fieldErrors?.degreeCode}
					required
				>
					<option value="" disabled selected={!form?.values?.degreeCode}>Seleziona titolo</option>
					{#each data.degrees as degree}
						<option value={degree.code} selected={form?.values?.degreeCode === degree.code}>
							{degree.label}
						</option>
					{/each}
				</select>
				{#if form?.fieldErrors?.degreeCode}
					<span class="field-error">{form.fieldErrors.degreeCode}</span>
				{/if}
			</div>

			{#if form?.globalError}
				<div class="global-error-box">
					{form.globalError}
				</div>
			{/if}

			<button type="submit" class="submit-btn">Registra Paziente</button>
		</form>
	</div>
</div>

<style>
	.page-header {
		margin-bottom: 24px;
	}

	.back-btn {
		background: none;
		border: none;
		color: #555;
		font-size: 16px;
		font-weight: 500;
		cursor: pointer;
		padding: 0;
	}

	.back-btn:hover {
		color: black;
		text-decoration: underline;
	}

	.form-wrapper {
		display: flex;
		justify-content: center;
		padding-top: 24px;
	}

	.form-container {
		width: 100%;
		max-width: 520px;
		background-color: white;
		padding: 32px;
		border-radius: 12px;
		border: 1px solid rgba(0, 0, 0, 0.08);
		box-shadow: 0 12px 24px rgba(0, 0, 0, 0.04);
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	h1 {
		margin: 0;
		font-size: 24px;
		text-align: center;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.input-row {
		display: flex;
		gap: 16px;
	}

	.input-row .input-group {
		flex: 1;
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	label {
		font-size: 14px;
		font-weight: 600;
		color: #333;
	}

	input,
	select {
		background-color: white;
		color: black;
		padding: 12px 16px;
		border-radius: 8px;
		border: 1.5px solid #ccc;
		font-size: 15px;
		width: 100%;
		box-sizing: border-box;
		transition: border-color 0.2s;
		font-family: inherit;
	}

	input:focus,
	select:focus {
		outline: none;
		border-color: black;
	}

	input.error,
	select.error {
		border-color: #d32f2f;
	}

	.field-error {
		color: #d32f2f;
		font-size: 13px;
		margin-left: 4px;
		font-weight: 500;
	}

	.global-error-box {
		background-color: #fde8e8;
		color: #c81e1e;
		padding: 12px;
		border-radius: 8px;
		border: 1px solid #f8b4b4;
		text-align: center;
		font-size: 14px;
		font-weight: 500;
	}

	.submit-btn {
		margin-top: 8px;
		background-color: black;
		color: white;
		padding: 14px;
		border: none;
		border-radius: 8px;
		font-size: 16px;
		font-weight: bold;
		cursor: pointer;
		transition: opacity 0.2s;
	}

	.submit-btn:hover {
		opacity: 0.85;
	}
</style>
