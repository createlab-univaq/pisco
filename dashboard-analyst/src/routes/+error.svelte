<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="error-container">
	<div class="error-card">
		<span class="error-code">{page.status}</span>
		<h1>Si è verificato un errore</h1>
		<p class="subtitle">
			{page.error?.message ||
				'La pagina richiesta non è disponibile o si è verificato un problema imprevisto.'}
		</p>
		<div class="actions">
			<a href="/" class="btn btn-primary">Torna alla Dashboard</a>
		</div>
	</div>
</div>

<style>
	.error-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 70vh;
		padding: 20px;
	}

	.error-card {
		background: white;
		border-radius: 12px;
		padding: 40px;
		max-width: 500px;
		width: 100%;
		text-align: center;
		border: 1px solid rgba(0, 0, 0, 0.08);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
	}

	.error-code {
		font-size: 48px;
		font-weight: 800;
		color: #d32f2f;
		display: block;
		margin-bottom: 12px;
	}

	h1 {
		margin: 0 0 8px 0;
		font-size: 22px;
	}

	.subtitle {
		margin: 0 0 24px 0;
		color: #666;
		font-size: 14px;
		line-height: 1.5;
	}

	.btn {
		display: inline-block;
		padding: 10px 20px;
		border-radius: 8px;
		font-weight: 600;
		text-decoration: none;
		font-size: 14px;
	}

	.btn-primary {
		background-color: black;
		color: white;
	}
</style>
