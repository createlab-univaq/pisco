<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import { toast } from '$lib/stores/toast.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let analyst = $derived(data.analyst || { firstName: '', lastName: '', email: '' });

	function confirmDelete(e: Event) {
		if (
			!confirm(
				'Sei sicuro di voler eliminare definitivamente il tuo account? Questa azione è irreversibile e comporterà la disconnessione immediata.'
			)
		) {
			e.preventDefault();
		}
	}
</script>

<div class="account-page">
	<div class="header-section">
		<h1>Profilo Analista</h1>
		<p class="subtitle">Gestisci le tue credenziali e i dati del tuo account.</p>
	</div>

	<div class="section-card">
		<form
			action="?/updateProfile"
			method="POST"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result.type === 'success') {
						toast.add('Profilo aggiornato con successo', 'success');
					} else if (result.type === 'failure') {
						const errData = result.data as Record<string, any>;
						toast.add(errData?.error || "Errore durante l'aggiornamento", 'error');
					}
					await update({ reset: false }); // Do not reset so the inputs keep the new values
				};
			}}
			class="profile-form"
		>
			<div class="input-row">
				<div class="form-group">
					<label for="firstName">Nome</label>
					<input
						type="text"
						id="firstName"
						name="firstName"
						value={analyst?.firstName || ''}
						required
					/>
				</div>
				<div class="form-group">
					<label for="lastName">Cognome</label>
					<input
						type="text"
						id="lastName"
						name="lastName"
						value={analyst?.lastName || ''}
						required
					/>
				</div>
			</div>

			<div class="form-group">
				<label for="email">Email</label>
				<input type="email" id="email" name="email" value={analyst?.email || ''} required />
			</div>

			<div class="form-group">
				<label for="password">Nuova Password</label>
				<input
					type="password"
					id="password"
					name="password"
					placeholder="Lascia vuoto per non modificare"
				/>
			</div>

			<button type="submit" class="btn btn-primary">Salva Modifiche</button>
		</form>
	</div>

	<div class="section-card danger-zone">
		<h2>Zona Pericolosa</h2>
		<p>
			Eliminando l'account, perderai l'accesso alla piattaforma e sarai disconnesso immediatamente.
		</p>

		<form
			action="?/deleteAccount"
			method="POST"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result.type === 'failure') {
						const errData = result.data as Record<string, any>;
						toast.add(errData?.error || "Impossibile eliminare l'account", 'error');
						await update();
					}
				};
			}}
		>
			<button type="submit" class="btn btn-danger" onclick={confirmDelete}>
				Elimina Account
			</button>
		</form>
	</div>
</div>

<style>
	.account-page {
		display: flex;
		flex-direction: column;
		gap: 24px;
		max-width: 600px;
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

	.section-card {
		background: white;
		border-radius: 12px;
		padding: 32px;
		border: 1px solid rgba(0, 0, 0, 0.08);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
	}

	.profile-form {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.input-row {
		display: flex;
		gap: 16px;
	}

	.input-row .form-group {
		flex: 1;
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

	input {
		padding: 12px 14px;
		border-radius: 8px;
		border: 1.5px solid #ccc;
		font-size: 15px;
		background: white;
		transition: border-color 0.2s;
		font-family: inherit;
	}

	input:focus {
		outline: none;
		border-color: black;
	}

	.btn {
		padding: 12px 16px;
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
		margin-top: 8px;
		align-self: flex-start;
	}

	.btn-danger {
		background-color: #d32f2f;
		color: white;
	}

	.btn-primary:hover,
	.btn-danger:hover {
		opacity: 0.85;
	}

	.danger-zone {
		border: 1px solid #f8b4b4;
		background-color: #fffafa;
	}

	.danger-zone h2 {
		margin-top: 0;
		color: #d32f2f;
		font-size: 18px;
	}

	.danger-zone p {
		font-size: 14px;
		color: #555;
		margin-bottom: 20px;
	}
</style>
