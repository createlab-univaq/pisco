<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div class="auth-wrapper">
	<div class="auth-container">
		<h1>Registrazione</h1>

		<form method="POST" use:enhance>
			<div class="input-group">
				<!-- We use class:error to dynamically apply a red border if this field fails -->
				<input
					type="text"
					id="firstName"
					name="firstName"
					placeholder="Nome"
					value={form?.values?.firstName ?? ''}
					class:error={form?.fieldErrors?.firstName}
					required
				/>
				{#if form?.fieldErrors?.firstName}
					<span class="field-error">{form.fieldErrors.firstName}</span>
				{/if}
			</div>

			<div class="input-group">
				<input
					type="text"
					id="lastName"
					name="lastName"
					placeholder="Cognome"
					value={form?.values?.lastName ?? ''}
					class:error={form?.fieldErrors?.lastName}
					required
				/>
				{#if form?.fieldErrors?.lastName}
					<span class="field-error">{form.fieldErrors.lastName}</span>
				{/if}
			</div>

			<div class="input-group">
				<input
					type="email"
					id="email"
					name="email"
					placeholder="Email"
					value={form?.values?.email ?? ''}
					class:error={form?.fieldErrors?.email}
					required
				/>
				{#if form?.fieldErrors?.email}
					<span class="field-error">{form.fieldErrors.email}</span>
				{/if}
			</div>

			<div class="input-group">
				<input
					type="password"
					id="password"
					name="password"
					placeholder="Password"
					class:error={form?.fieldErrors?.password}
					required
				/>
				{#if form?.fieldErrors?.password}
					<span class="field-error">{form.fieldErrors.password}</span>
				{/if}
			</div>

			<!-- Global Error gets its own distinct box now -->
			{#if form?.globalError}
				<div class="global-error-box">
					{form.globalError}
				</div>
			{/if}

			<button type="submit">Registrati</button>
		</form>

		<a href="/login" class="text-button">Hai gia un account? Accedi</a>
	</div>
</div>

<style>
	/* Added strict font-family to override any browser defaults causing that serif look */
	.auth-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		padding: 24px;
		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			sans-serif;
	}

	.auth-container {
		width: 100%;
		max-width: 460px;
		background-color: rgba(255, 255, 255, 0.92);
		padding: 32px;
		border-radius: 12px;
		border: 1px solid rgba(0, 0, 0, 0.08);
		box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	h1 {
		text-align: center;
		font-size: 26px;
		font-weight: bold;
		color: black;
		margin: 0 0 4px 0;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 16px; /* Slightly increased gap for better breathing room */
	}

	.input-group {
		display: flex;
		flex-direction: column;
	}

	input {
		background-color: white;
		color: black;
		padding: 14px 16px;
		border-radius: 8px;
		border: 1.5px solid black;
		font-size: 16px;
		width: 100%;
		box-sizing: border-box;
		transition: border-color 0.2s; /* Smooth transition for error states */
	}

	input:focus {
		outline: none;
		border-width: 2px;
	}

	/* Target the input when it has an error */
	input.error {
		border-color: #d32f2f;
	}
	input.error:focus {
		border-color: #d32f2f;
		outline: 1px solid #d32f2f;
	}

	.field-error {
		color: #d32f2f;
		font-size: 13px;
		margin-top: 6px;
		margin-left: 4px;
		font-weight: 500;
	}

	/* Distinct styling for the API global error */
	.global-error-box {
		background-color: #fde8e8;
		color: #c81e1e;
		padding: 12px;
		border-radius: 8px;
		border: 1px solid #f8b4b4;
		text-align: center;
		font-size: 14px;
		font-weight: 500;
		margin-top: 4px;
	}

	button {
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

	button:hover {
		opacity: 0.85;
	}

	.text-button {
		text-align: center;
		color: black;
		text-decoration: none;
		font-size: 14px;
		margin-top: 8px;
	}

	.text-button:hover {
		text-decoration: underline;
	}
</style>
