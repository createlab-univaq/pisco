<script lang="ts">
	import type { PageData } from './$types';

	// Receive the data returned from +page.server.ts
	let { data }: { data: PageData } = $props();
</script>

<div class="dashboard-container">
	<header>
		<h1>Dashboard Analista</h1>
		<!-- Add a logout form here later -->
	</header>

	<main>
		<h2>Lista Utenti</h2>

		{#if data.users.length === 0}
			<p>Nessun utente trovato o errore nel caricamento.</p>
		{:else}
			<ul class="user-list">
				{#each data.users as user}
					<li class="user-card">
						<!-- Adjust these properties based on your actual API response structure -->
						<strong>{user.firstName} {user.lastName}</strong>
						<p>{user.email}</p>
					</li>
				{/each}
			</ul>
		{/if}
	</main>
</div>

<style>
	/* Add some basic styling matching your Flutter theme */
	:global(body) {
		margin: 0;
		background-color: #f4f6f8;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
	}

	.dashboard-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 24px;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 32px;
	}

	.user-list {
		list-style: none;
		padding: 0;
		display: grid;
		gap: 16px;
	}

	.user-card {
		background-color: white;
		padding: 16px;
		border-radius: 8px;
		border: 1px solid rgba(0, 0, 0, 0.08);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
	}
</style>
