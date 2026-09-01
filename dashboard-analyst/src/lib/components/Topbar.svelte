<script lang="ts">
	import { page } from '$app/stores';
</script>

<header class="topbar">
	<div class="spacer"></div>

	<div class="actions-container">
		<!-- Account Page Link -->
		<a href="/account" class="profile-link" class:active={$page.url.pathname === '/account'}>
			<span class="icon">👤</span>
			<span class="text">Il mio Profilo</span>
		</a>

		<!-- Logout Form -->
		<form action="/logout" method="POST">
			<button type="submit" class="logout-btn"> Logout </button>
		</form>
	</div>
</header>

<style>
	.topbar {
		height: 70px;
		background-color: white;
		border-bottom: 1px solid rgba(0, 0, 0, 0.08);
		display: flex;
		align-items: center;
		padding: 0 24px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
	}

	.spacer {
		flex: 1;
	}

	.actions-container {
		display: flex;
		align-items: center;
		gap: 20px;
	}

	.profile-link {
		display: flex;
		align-items: center;
		gap: 8px;
		text-decoration: none;
		color: #555;
		font-weight: 600;
		font-size: 14px;
		padding: 8px 12px;
		border-radius: 6px;
		transition:
			background-color 0.2s,
			color 0.2s;
	}

	.profile-link:hover {
		background-color: #f4f6f8;
		color: black;
	}

	.profile-link.active {
		background-color: #f4f6f8;
		color: black;
	}

	.icon {
		font-size: 16px;
	}

	.logout-btn {
		background-color: transparent;
		color: #d32f2f;
		border: 1px solid #d32f2f;
		padding: 8px 16px;
		border-radius: 6px;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.2s;
	}

	.logout-btn:hover {
		background-color: #d32f2f;
		color: white;
	}
</style>
