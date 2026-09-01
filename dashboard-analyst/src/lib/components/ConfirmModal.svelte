<script lang="ts">
	let {
		isOpen = $bindable(false),
		title = 'Conferma Operazione',
		message = 'Sei sicuro di voler procedere?',
		confirmText = 'Conferma',
		cancelText = 'Annulla',
		onConfirm
	}: {
		isOpen: boolean;
		title?: string;
		message: string;
		confirmText?: string;
		cancelText?: string;
		onConfirm: () => void;
	} = $props();
</script>

{#if isOpen}
	<div
		class="modal-backdrop"
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		onclick={() => (isOpen = false)}
		onkeydown={(e) => {
			if (e.key === 'Escape') isOpen = false;
		}}
	>
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div
			class="modal-card"
			role="document"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
		>
			<div class="modal-header">
				<h3>{title}</h3>
			</div>
			<div class="modal-body">
				<p>{message}</p>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" onclick={() => (isOpen = false)}>
					{cancelText}
				</button>
				<button
					type="button"
					class="btn btn-danger"
					onclick={() => {
						isOpen = false;
						onConfirm();
					}}
				>
					{confirmText}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		backdrop-filter: blur(2px);
	}
	.modal-card {
		background: white;
		border-radius: 12px;
		padding: 24px;
		width: 100%;
		max-width: 420px;
		box-shadow:
			0 20px 25px -5px rgba(0, 0, 0, 0.1),
			0 10px 10px -5px rgba(0, 0, 0, 0.04);
		display: flex;
		flex-direction: column;
		gap: 16px;
		animation: fadeIn 0.2s ease-out;
	}
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
	.modal-header h3 {
		margin: 0;
		font-size: 18px;
		color: #111;
	}
	.modal-body p {
		margin: 0;
		font-size: 14px;
		color: #4b5563;
		line-height: 1.5;
	}
	.modal-footer {
		display: flex;
		justify-content: flex-end;
		gap: 12px;
		margin-top: 8px;
	}
	.btn {
		padding: 10px 16px;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		border: none;
		font-size: 14px;
		transition: opacity 0.2s;
	}
	.btn-secondary {
		background-color: #f3f4f6;
		color: #374151;
	}
	.btn-danger {
		background-color: #d32f2f;
		color: white;
	}
	.btn:hover {
		opacity: 0.85;
	}
</style>
