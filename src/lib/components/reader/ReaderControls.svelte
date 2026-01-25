<script lang="ts">
	import { currentPage, totalPages, progressPercent, readerSettings, hasNextPage, hasPrevPage } from '$lib/stores/reader';

	interface Props {
		visible?: boolean;
		onSettingsClick?: () => void;
	}

	let { visible = true, onSettingsClick }: Props = $props();
</script>

<div class="controls" class:visible>
	<!-- Top bar -->
	<div class="controls-top">
		<a href="/" class="back-link">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M19 12H5M12 19l-7-7 7-7"/>
			</svg>
		</a>

		<button class="settings-btn" onclick={onSettingsClick} aria-label="Settings">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<circle cx="12" cy="12" r="3"/>
				<path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
			</svg>
		</button>
	</div>

	<!-- Bottom bar -->
	<div class="controls-bottom">
		<!-- Progress bar -->
		<div class="progress-bar">
			<div class="progress-fill" style="width: {$progressPercent}%"></div>
		</div>

		<div class="controls-row">
			<!-- Navigation buttons (page mode only) -->
			{#if $readerSettings.mode === 'page'}
				<button 
					class="nav-btn" 
					onclick={() => currentPage.prev()}
					disabled={!$hasPrevPage}
					aria-label="Previous page"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M15 18l-6-6 6-6"/>
					</svg>
				</button>
			{/if}

			<!-- Page indicator -->
			<div class="page-indicator">
				<span class="current">{$currentPage}</span>
				<span class="separator">/</span>
				<span class="total">{$totalPages}</span>
			</div>

			{#if $readerSettings.mode === 'page'}
				<button 
					class="nav-btn" 
					onclick={() => currentPage.next($totalPages)}
					disabled={!$hasNextPage}
					aria-label="Next page"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M9 18l6-6-6-6"/>
					</svg>
				</button>
			{/if}
		</div>
	</div>
</div>

<style>
	.controls {
		position: fixed;
		inset: 0;
		pointer-events: none;
		opacity: 0;
		transition: opacity var(--transition-normal);
		z-index: var(--z-sticky);
	}

	.controls.visible {
		opacity: 1;
	}

	.controls-top,
	.controls-bottom {
		pointer-events: auto;
	}

	.controls-top {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-md);
		padding-top: calc(var(--spacing-md) + var(--safe-area-top));
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), transparent);
	}

	.controls-bottom {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: var(--spacing-md);
		padding-bottom: calc(var(--spacing-md) + var(--safe-area-bottom));
		background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
	}

	.back-link,
	.settings-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		color: var(--color-text);
		background-color: rgba(0, 0, 0, 0.5);
		border-radius: var(--radius-lg);
		transition: background-color var(--transition-fast);
	}

	.back-link:hover,
	.settings-btn:hover {
		background-color: rgba(0, 0, 0, 0.7);
	}

	.progress-bar {
		height: 3px;
		background-color: rgba(255, 255, 255, 0.2);
		border-radius: 2px;
		margin-bottom: var(--spacing-md);
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background-color: var(--color-primary);
		transition: width var(--transition-fast);
	}

	.controls-row {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-lg);
	}

	.nav-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		color: var(--color-text);
		background-color: rgba(0, 0, 0, 0.5);
		border-radius: var(--radius-lg);
		transition: all var(--transition-fast);
	}

	.nav-btn:hover:not(:disabled) {
		background-color: var(--color-primary);
	}

	.nav-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.page-indicator {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		font-size: 1rem;
		font-weight: 500;
		color: var(--color-text);
		background-color: rgba(0, 0, 0, 0.5);
		padding: var(--spacing-sm) var(--spacing-md);
		border-radius: var(--radius-lg);
	}

	.separator {
		color: var(--color-text-muted);
	}

	.total {
		color: var(--color-text-secondary);
	}
</style>
