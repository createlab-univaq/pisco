<script lang="ts">
	import { page } from '$app/stores';
</script>

<aside class="sidebar">
	<div class="logo-container">
		<h2>Dashboard</h2>
	</div>

	<nav>
		<a href="/" class:active={$page.url.pathname === '/'}> Home </a>
		<a href="/patients" class:active={$page.url.pathname.startsWith('/patients')}> Gestione Pazienti </a>
		<a href="/paths" class:active={$page.url.pathname.startsWith('/paths')}> Percorsi </a>
		<a href="/assign" class:active={$page.url.pathname.startsWith('/assign')}> Assegna Percorso </a>
	</nav>
</aside>

<style>
	.sidebar {
		width: 250px;
		background-color: white; /* Changed from #111 to white */
		color: black; /* Changed text to black */
		display: flex;
		flex-direction: column;
		height: 100vh;
		border-right: 1px solid rgba(0, 0, 0, 0.08); /* Soft separator line */
	}

	.logo-container {
		padding: 24px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.08);
	}

	.logo-container h2 {
		margin: 0;
		font-size: 20px;
		font-weight: bold;
	}

	nav {
		display: flex;
		flex-direction: column;
		padding: 16px 0;
	}

	a {
		color: #555; /* Dark gray for unselected links */
		text-decoration: none;
		padding: 16px 24px;
		font-size: 16px;
		font-weight: 500;
		transition:
			background-color 0.2s,
			color 0.2s;
	}

	a:hover {
		background-color: #f4f6f8; /* Soft gray hover */
		color: black;
	}

	a.active {
		background-color: #f4f6f8;
		color: black;
		border-left: 4px solid black; /* Keep the active indicator crisp */
	}
</style>
