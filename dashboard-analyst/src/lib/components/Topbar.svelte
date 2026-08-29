<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<header class="topbar">
	<div class="spacer"></div>
	<!-- Pushes the logout button to the right -->

	<!-- The form posts to the /logout route we will create -->
	<form action="/logout" method="POST" use:enhance>
		<button type="submit" class="logout-btn"> Logout </button>
	</form>
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
