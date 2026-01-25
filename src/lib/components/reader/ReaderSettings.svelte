<script lang="ts">
	import { readerSettings } from '$lib/stores/reader';

	interface Props {
		onClose?: () => void;
	}

	let { onClose }: Props = $props();

	function handleOverlayClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onClose?.();
		}
	}
</script>

<div class="settings-overlay" onclick={handleOverlayClick} role="dialog" aria-modal="true">
	<div class="settings-panel">
		<div class="settings-header">
			<h2>Reader Settings</h2>
			<button class="close-btn" onclick={onClose} aria-label="Close settings">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M18 6L6 18M6 6l12 12"/>
				</svg>
			</button>
		</div>

		<div class="settings-content">
			<!-- Reading Mode -->
			<div class="setting-group">
				<label class="setting-label">Reading Mode</label>
				<div class="mode-buttons">
					<button 
						class="mode-btn"
						class:active={$readerSettings.mode === 'page'}
						onclick={() => readerSettings.setMode('page')}
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<rect x="3" y="3" width="18" height="18" rx="2"/>
						</svg>
						Page
					</button>
					<button 
						class="mode-btn"
						class:active={$readerSettings.mode === 'scroll'}
						onclick={() => readerSettings.setMode('scroll')}
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M12 5v14M5 12h14"/>
						</svg>
						Scroll
					</button>
				</div>
			</div>

			<!-- Brightness -->
			<div class="setting-group">
				<label class="setting-label">
					Brightness
					<span class="value">{$readerSettings.brightness}%</span>
				</label>
				<input 
					type="range" 
					min="50" 
					max="100" 
					value={$readerSettings.brightness}
					oninput={(e) => readerSettings.setBrightness(parseInt(e.currentTarget.value))}
					class="brightness-slider"
				/>
			</div>

			<!-- Keyboard Shortcuts -->
			<div class="setting-group">
				<label class="setting-label">Keyboard Shortcuts</label>
				<div class="shortcuts-list">
					<div class="shortcut">
						<kbd>←</kbd> / <kbd>→</kbd>
						<span>Previous / Next page</span>
					</div>
					<div class="shortcut">
						<kbd>Esc</kbd>
						<span>Close settings</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.settings-overlay {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: var(--z-modal);
		padding: var(--spacing-md);
	}

	.settings-panel {
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-xl);
		width: 100%;
		max-width: 400px;
		max-height: 80vh;
		overflow-y: auto;
	}

	.settings-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--spacing-lg);
		border-bottom: 1px solid var(--color-border);
	}

	.settings-header h2 {
		font-size: 1.125rem;
		font-weight: 600;
	}

	.close-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		color: var(--color-text-secondary);
		border-radius: var(--radius-md);
		transition: all var(--transition-fast);
	}

	.close-btn:hover {
		background-color: var(--color-bg-tertiary);
		color: var(--color-text);
	}

	.settings-content {
		padding: var(--spacing-lg);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xl);
	}

	.setting-group {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.setting-label {
		display: flex;
		justify-content: space-between;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-secondary);
	}

	.value {
		color: var(--color-text);
	}

	.mode-buttons {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--spacing-sm);
	}

	.mode-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-sm);
		padding: var(--spacing-md);
		background-color: var(--color-bg-tertiary);
		color: var(--color-text-secondary);
		border-radius: var(--radius-md);
		font-weight: 500;
		transition: all var(--transition-fast);
	}

	.mode-btn:hover {
		background-color: var(--color-border);
	}

	.mode-btn.active {
		background-color: var(--color-primary);
		color: var(--color-text);
	}

	.brightness-slider {
		width: 100%;
		height: 6px;
		-webkit-appearance: none;
		appearance: none;
		background: var(--color-bg-tertiary);
		border-radius: 3px;
		outline: none;
	}

	.brightness-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 18px;
		height: 18px;
		background: var(--color-primary);
		border-radius: 50%;
		cursor: pointer;
	}

	.brightness-slider::-moz-range-thumb {
		width: 18px;
		height: 18px;
		background: var(--color-primary);
		border-radius: 50%;
		cursor: pointer;
		border: none;
	}

	.shortcuts-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.shortcut {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		font-size: 0.875rem;
	}

	.shortcut span {
		color: var(--color-text-muted);
	}

	kbd {
		padding: var(--spacing-xs) var(--spacing-sm);
		background-color: var(--color-bg-tertiary);
		border-radius: var(--radius-sm);
		font-family: monospace;
		font-size: 0.75rem;
		color: var(--color-text);
	}
</style>
