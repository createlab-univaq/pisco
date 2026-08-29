<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div class="auth-wrapper">
	<div class="auth-container">
		<h1>Login</h1>

		<form method="POST" use:enhance>
			<div class="input-group">
				<input
					type="email"
					id="email"
					name="email"
					placeholder="Email"
					value={form?.values?.email ?? ''}
					required
				/>
			</div>

			<div class="input-group">
				<input type="password" id="password" name="password" placeholder="Password" required />
			</div>

			<!-- Global Error distinct box -->
			{#if form?.globalError}
				<div class="global-error-box">
					{form.globalError}
				</div>
			{/if}

			<button type="submit">Login</button>
		</form>

		<a href="/register" class="text-button">Non hai un account? Registrati</a>
	</div>
</div>

<style>
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
		max-width: 420px;
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
		gap: 16px;
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
		transition: border-color 0.2s;
	}

	input:focus {
		outline: none;
		border-width: 2px;
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
