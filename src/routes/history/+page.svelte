<script lang="ts">
	import type { PageData } from './$types';
	import type { ReadingHistoryWithDetails } from '$lib/types';
	import { invalidateAll } from '$app/navigation';
	import { toast } from '$lib/stores/toast';

	let { data }: { data: PageData } = $props();

	// Cast to correct type since the query returns ReadingHistoryWithDetails
	const history = $derived(data.history as unknown as ReadingHistoryWithDetails[]);

	let clearing = $state(false);

	async function clearHistory() {
		if (!confirm('Are you sure you want to clear your reading history?')) {
			return;
		}

		clearing = true;

		try {
			const response = await fetch('/api/history', { method: 'DELETE' });
			if (response.ok) {
				toast.success('Reading history cleared');
				await invalidateAll();
			} else {
				toast.error('Failed to clear history');
			}
		} catch (err) {
			console.error('Failed to clear history:', err);
			toast.error('An error occurred');
		} finally {
			clearing = false;
		}
	}

	function formatDate(date: Date): string {
		const now = new Date();
		const readDate = new Date(date);
		const diffMs = now.getTime() - readDate.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return 'Just now';
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;
		return readDate.toLocaleDateString();
	}
</script>

<svelte:head>
	<title>Reading History | MangaAja</title>
</svelte:head>

<div class="page">
	<header class="header">
		<div class="container">
			<a href="/" class="back-link">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M19 12H5M12 19l-7-7 7-7"/>
				</svg>
				<span>Home</span>
			</a>
			<h1 class="page-title">History</h1>
		</div>
	</header>

	<main class="main">
		<div class="container">
			<!-- Tabs -->
			<nav class="tabs">
				<a href="/library" class="tab">Bookmarks</a>
				<a href="/history" class="tab active">History</a>
			</nav>

			<!-- History -->
			<section class="section">
				{#if history.length > 0}
					<div class="history-header">
						<p class="history-count">{history.length} entries</p>
						<button class="clear-btn" onclick={clearHistory} disabled={clearing}>
							{#if clearing}
								<span class="spinner"></span>
								Clearing...
							{:else}
								Clear History
							{/if}
						</button>
					</div>
				{/if}

				{#if history.length === 0}
					<div class="empty-state">
						<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
							<circle cx="12" cy="12" r="10"/>
							<polyline points="12 6 12 12 16 14"/>
						</svg>
						<p>No reading history</p>
						<span class="empty-description">Start reading manga to see your history here</span>
						<a href="/browse" class="browse-link">Browse Manga</a>
					</div>
				{:else}
					<div class="history-list">
						{#each history as entry (entry.id)}
							<a href="/read/{entry.manga.slug}/{entry.chapter.chapterNumber}" class="history-item">
								<div class="history-cover">
									{#if entry.manga.coverUrl}
										<img src={entry.manga.coverUrl} alt={entry.manga.title} />
									{:else}
										<div class="cover-placeholder">
											<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
												<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
												<circle cx="8.5" cy="8.5" r="1.5"/>
												<polyline points="21 15 16 10 5 21"/>
											</svg>
										</div>
									{/if}
								</div>
								<div class="history-info">
									<p class="manga-title">{entry.manga.title}</p>
									<p class="chapter-info">
										Chapter {entry.chapter.chapterNumber}
										{#if entry.chapter.title}
											- {entry.chapter.title}
										{/if}
									</p>
								</div>
								<div class="history-meta">
									<p class="history-date">{formatDate(entry.readAt)}</p>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="arrow-icon">
										<polyline points="9 18 15 12 9 6"/>
									</svg>
								</div>
							</a>
						{/each}
					</div>
				{/if}
			</section>
		</div>
	</main>
</div>

<style>
	.page {
		min-height: 100vh;
		background-color: var(--color-bg);
	}

	.header {
		padding: var(--spacing-md) 0;
		padding-top: calc(var(--spacing-md) + var(--safe-area-top));
		border-bottom: 1px solid var(--color-border);
	}

	.header .container {
		display: flex;
		align-items: center;
		gap: var(--spacing-lg);
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-sm);
		color: var(--color-text-secondary);
		font-weight: 500;
		transition: color var(--transition-fast);
	}

	.back-link:hover {
		color: var(--color-text);
	}

	.page-title {
		font-size: 1.25rem;
		font-weight: 600;
	}

	.main {
		padding: var(--spacing-xl) 0;
	}

	.tabs {
		display: flex;
		gap: var(--spacing-sm);
		margin-bottom: var(--spacing-xl);
	}

	.tab {
		padding: var(--spacing-sm) var(--spacing-lg);
		background-color: var(--color-bg-secondary);
		color: var(--color-text-secondary);
		font-weight: 500;
		border-radius: var(--radius-lg);
		transition: all var(--transition-fast);
	}

	.tab:hover {
		background-color: var(--color-bg-tertiary);
	}

	.tab.active {
		background-color: var(--color-primary);
		color: white;
	}

	.history-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--spacing-lg);
	}

	.history-count {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}

	.clear-btn {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		padding: var(--spacing-sm) var(--spacing-md);
		background-color: var(--color-bg-secondary);
		color: var(--color-error);
		font-size: 0.875rem;
		font-weight: 500;
		border-radius: var(--radius-md);
		transition: all var(--transition-fast);
	}

	.clear-btn:hover:not(:disabled) {
		background-color: var(--color-error);
		color: white;
	}

	.clear-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.spinner {
		width: 14px;
		height: 14px;
		border: 2px solid rgba(239, 68, 68, 0.3);
		border-top-color: currentColor;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.history-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.history-item {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		padding: var(--spacing-md);
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-lg);
		transition: all var(--transition-fast);
	}

	.history-item:hover {
		background-color: var(--color-bg-tertiary);
		transform: translateX(4px);
	}

	.history-cover {
		width: 50px;
		height: 70px;
		flex-shrink: 0;
		border-radius: var(--radius-md);
		overflow: hidden;
		background-color: var(--color-bg-tertiary);
	}

	.history-cover img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.cover-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text-muted);
	}

	.history-info {
		flex: 1;
		min-width: 0;
	}

	.manga-title {
		font-weight: 600;
		color: var(--color-text);
		margin-bottom: var(--spacing-xs);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.chapter-info {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.history-meta {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		flex-shrink: 0;
	}

	.history-date {
		font-size: 0.75rem;
		color: var(--color-text-muted);
		white-space: nowrap;
	}

	.arrow-icon {
		color: var(--color-text-muted);
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-md);
		padding: var(--spacing-2xl);
		color: var(--color-text-muted);
		text-align: center;
	}

	.empty-description {
		font-size: 0.875rem;
		color: var(--color-text-muted);
	}

	.browse-link {
		padding: var(--spacing-sm) var(--spacing-lg);
		background-color: var(--color-primary);
		color: white;
		font-weight: 500;
		border-radius: var(--radius-md);
		margin-top: var(--spacing-sm);
	}

	.browse-link:hover {
		background-color: var(--color-primary-hover);
	}
</style>
