<script lang="ts">
	import { toast, type Toast } from '$lib/stores/toast';
	import { fly, fade } from 'svelte/transition';

	let toasts = $state<Toast[]>([]);

	$effect(() => {
		const unsubscribe = toast.subscribe((value) => {
			toasts = value;
		});
		return unsubscribe;
	});

	function getIcon(type: Toast['type']) {
		switch (type) {
			case 'success':
				return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
			case 'error':
				return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
			case 'warning':
				return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
			case 'info':
			default:
				return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
		}
	}
</script>

{#if toasts.length > 0}
	<div class="toast-container" role="region" aria-label="Notifications">
		{#each toasts as t (t.id)}
			<div
				class="toast toast-{t.type}"
				role="alert"
				in:fly={{ y: -20, duration: 300 }}
				out:fade={{ duration: 200 }}
			>
				<span class="toast-icon">
					{@html getIcon(t.type)}
				</span>
				<span class="toast-message">{t.message}</span>
				<button
					class="toast-close"
					onclick={() => toast.remove(t.id)}
					aria-label="Close notification"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<line x1="18" y1="6" x2="6" y2="18"/>
						<line x1="6" y1="6" x2="18" y2="18"/>
					</svg>
				</button>
			</div>
		{/each}
	</div>
{/if}

<style>
	.toast-container {
		position: fixed;
		top: calc(var(--spacing-lg) + var(--safe-area-top, 0px));
		right: var(--spacing-lg);
		z-index: 9999;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		max-width: 400px;
		width: calc(100vw - var(--spacing-lg) * 2);
		pointer-events: none;
	}

	.toast {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		padding: var(--spacing-md) var(--spacing-lg);
		border-radius: var(--radius-lg);
		background: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
		pointer-events: auto;
		animation: slideIn 0.3s ease-out;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateX(20px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.toast-success {
		border-color: #22c55e;
		background: linear-gradient(135deg, rgba(34, 197, 94, 0.15), var(--color-bg-secondary));
	}

	.toast-success .toast-icon {
		color: #22c55e;
	}

	.toast-error {
		border-color: #ef4444;
		background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), var(--color-bg-secondary));
	}

	.toast-error .toast-icon {
		color: #ef4444;
	}

	.toast-warning {
		border-color: #f59e0b;
		background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), var(--color-bg-secondary));
	}

	.toast-warning .toast-icon {
		color: #f59e0b;
	}

	.toast-info {
		border-color: #3b82f6;
		background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), var(--color-bg-secondary));
	}

	.toast-info .toast-icon {
		color: #3b82f6;
	}

	.toast-icon {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.toast-message {
		flex: 1;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text);
		line-height: 1.4;
	}

	.toast-close {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		border: none;
		background: transparent;
		color: var(--color-text-muted);
		cursor: pointer;
		border-radius: var(--radius-sm);
		transition: all var(--transition-fast);
	}

	.toast-close:hover {
		background: rgba(255, 255, 255, 0.1);
		color: var(--color-text);
	}

	@media (max-width: 480px) {
		.toast-container {
			left: var(--spacing-md);
			right: var(--spacing-md);
			width: auto;
			max-width: none;
		}
	}
</style>
