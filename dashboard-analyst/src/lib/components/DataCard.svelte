<script lang="ts">
	let {
		icon,
		title,
		value,
		color = 'black'
	}: {
		icon: string;
		title: string;
		value: string | number;
		color?: string;
	} = $props();
</script>

<div class="data-card">
	<div class="icon-wrapper" style="background-color: {color}20; color: {color};">
		{#if icon === 'person'}
			<!-- Person Icon -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg
			>
		{:else if icon === 'male'}
			<!-- Male Icon -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				><circle cx="10" cy="14" r="5" /><line x1="13.5" y1="10.5" x2="21" y2="3" /><line
					x1="16"
					y1="3"
					x2="21"
					y2="3"
				/><line x1="21" y1="3" x2="21" y2="8" /></svg
			>
		{:else if icon === 'female'}
			<!-- Female Icon -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				><circle cx="12" cy="10" r="6" /><line x1="12" y1="16" x2="12" y2="22" /><line
					x1="9"
					y1="19"
					x2="15"
					y2="19"
				/></svg
			>
		{:else if icon === 'route'}
			<!-- Route Icon -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				><circle cx="6" cy="19" r="3" /><path
					d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"
				/><circle cx="18" cy="5" r="3" /></svg
			>
		{:else}
			<!-- Fallback generic icon -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /></svg
			>
		{/if}
	</div>

	<div class="card-info">
		<h3 class="title">{title}</h3>
		<p class="value">{value}</p>
	</div>
</div>

<style>
	.data-card {
		background-color: white;
		border-radius: 12px;
		padding: 20px;
		display: flex;
		align-items: center;
		gap: 16px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		border: 1px solid rgba(0, 0, 0, 0.05);
	}

	.icon-wrapper {
		width: 50px;
		height: 50px;
		border-radius: 12px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.card-info {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.title {
		margin: 0;
		font-size: 14px;
		color: #666;
		font-weight: 500;
	}

	.value {
		margin: 4px 0 0 0;
		font-size: 24px;
		font-weight: bold;
		color: #111;
	}
</style>
