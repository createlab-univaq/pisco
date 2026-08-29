<script lang="ts">
	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Topbar from '$lib/components/Topbar.svelte';
	import ToastContainer from '$lib/components/ToastContainer.svelte';
	import { page } from '$app/state';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	let isAuthRoute = $derived(
		page.url.pathname.includes('/login') || page.url.pathname.includes('/register')
	);
</script>

<ToastContainer />

{#if isAuthRoute}
	{@render children()}
{:else}
	<div class="app-layout">
		<Sidebar />
		<div class="main-content">
			<Topbar />
			<main class="page-container">
				{@render children()}
			</main>
		</div>
	</div>
{/if}

<style>
	:global(body) {
		margin: 0;
		background-color: white;
		font-family: system-ui, sans-serif;
	}

	.app-layout {
		display: flex;
		height: 100vh;
		overflow: hidden;
	}

	.main-content {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: hidden;
	}

	.page-container {
		flex: 1;
		overflow-y: auto;
		padding: 24px;
		background-color: #f4f6f8;
	}
</style>
