<script lang="ts">
	import { toast } from '$lib/stores/toast.svelte';
	import { flip } from 'svelte/animate';
	import { fade, fly } from 'svelte/transition';
</script>

<div class="toast-container" aria-live="polite" aria-atomic="true">
	{#each toast.toasts as item (item.id)}
		<div
			class="toast-item {item.type}"
			in:fly={{ y: 20, duration: 250 }}
			out:fade={{ duration: 150 }}
			animate:flip={{ duration: 200 }}
		>
			<div class="icon">
				{#if item.type === 'success'}
					✓
				{:else if item.type === 'error'}
					✕
				{:else}
					ℹ
				{/if}
			</div>
			<div class="message">{item.message}</div>
			<button
				type="button"
				class="close-btn"
				onclick={() => toast.remove(item.id)}
				aria-label="Chiudi notifica"
			>
				✕
			</button>
		</div>
	{/each}
</div>

<style>
	.toast-container {
		position: fixed;
		bottom: 24px;
		right: 24px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		z-index: 9999;
		pointer-events: none;
		max-width: 380px;
		width: 100%;
	}

	.toast-item {
		pointer-events: auto;
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 16px;
		background: white;
		border-radius: 8px;
		border: 1px solid rgba(0, 0, 0, 0.08);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
		font-size: 14px;
		color: #111;
	}

	.toast-item.success {
		border-left: 4px solid #10b981;
	}

	.toast-item.success .icon {
		color: #10b981;
		font-weight: bold;
	}

	.toast-item.error {
		border-left: 4px solid #ef4444;
	}

	.toast-item.error .icon {
		color: #ef4444;
		font-weight: bold;
	}

	.toast-item.info {
		border-left: 4px solid #3b82f6;
	}

	.toast-item.info .icon {
		color: #3b82f6;
		font-weight: bold;
	}

	.message {
		flex: 1;
		line-height: 1.4;
	}

	.close-btn {
		background: transparent;
		border: none;
		cursor: pointer;
		color: #999;
		font-size: 12px;
		padding: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color 0.15s;
	}

	.close-btn:hover {
		color: #333;
	}
</style>
