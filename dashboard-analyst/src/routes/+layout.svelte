<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';

	// We accept 'data' from +layout.server.ts and 'children' for the nested pages
	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Optional: You can now access data.token here if you need it for the UI -->

{@render children()}
