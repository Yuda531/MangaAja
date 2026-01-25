<script lang="ts">
	interface Props {
		mangaId: string;
		bookmarked?: boolean;
	}

	let { mangaId, bookmarked = false }: Props = $props();

	let isBookmarked = $state(bookmarked);
	let loading = $state(false);

	async function toggleBookmark() {
		loading = true;

		try {
			if (isBookmarked) {
				await fetch(`/api/bookmarks?mangaId=${mangaId}`, { method: 'DELETE' });
				isBookmarked = false;
			} else {
				await fetch('/api/bookmarks', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ mangaId })
				});
				isBookmarked = true;
			}
		} catch (err) {
			console.error('Failed to toggle bookmark:', err);
		} finally {
			loading = false;
		}
	}
</script>

<button 
	class="bookmark-btn"
	class:bookmarked={isBookmarked}
	class:loading
	onclick={toggleBookmark}
	disabled={loading}
	aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
>
	<svg 
		xmlns="http://www.w3.org/2000/svg" 
		width="20" 
		height="20" 
		viewBox="0 0 24 24" 
		fill={isBookmarked ? 'currentColor' : 'none'} 
		stroke="currentColor" 
		stroke-width="2" 
		stroke-linecap="round" 
		stroke-linejoin="round"
	>
		<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
	</svg>
</button>

<style>
	.bookmark-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		background-color: var(--color-bg-secondary);
		color: var(--color-text);
		border-radius: var(--radius-lg);
		transition: all var(--transition-fast);
	}

	.bookmark-btn:hover:not(:disabled) {
		background-color: var(--color-bg-tertiary);
	}

	.bookmark-btn.bookmarked {
		color: var(--color-primary);
	}

	.bookmark-btn.loading {
		opacity: 0.7;
		cursor: wait;
	}

	.bookmark-btn:disabled {
		cursor: not-allowed;
	}
</style>
