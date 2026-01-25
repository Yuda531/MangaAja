<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	async function clearHistory() {
		if (!confirm('Are you sure you want to clear your reading history?')) {
			return;
		}

		try {
			await fetch('/api/history', { method: 'DELETE' });
			window.location.reload();
		} catch (err) {
			console.error('Failed to clear history:', err);
		}
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
				{#if data.history.length > 0}
					<div class="history-header">
						<button class="clear-btn" onclick={clearHistory}>
							Clear History
						</button>
					</div>
				{/if}

				{#if data.history.length === 0}
					<div class="empty-state">
						<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
							<circle cx="12" cy="12" r="10"/>
							<polyline points="12 6 12 12 16 14"/>
						</svg>
						<p>No reading history</p>
						<a href="/browse" class="browse-link">Start reading</a>
					</div>
				{:else}
					<div class="history-list">
						{#each data.history as entry (entry.id)}
							<div class="history-item">
								<div class="history-info">
									<p class="manga-title">Manga ID: {entry.mangaId}</p>
									<p class="chapter-info">Chapter ID: {entry.chapterId}</p>
								</div>
								<p class="history-date">
									{new Date(entry.readAt).toLocaleDateString()}
								</p>
							</div>
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
		justify-content: flex-end;
		margin-bottom: var(--spacing-lg);
	}

	.clear-btn {
		padding: var(--spacing-sm) var(--spacing-md);
		background-color: var(--color-bg-secondary);
		color: var(--color-error);
		font-size: 0.875rem;
		font-weight: 500;
		border-radius: var(--radius-md);
		transition: all var(--transition-fast);
	}

	.clear-btn:hover {
		background-color: var(--color-error);
		color: white;
	}

	.history-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.history-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--spacing-md);
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-md);
	}

	.manga-title {
		font-weight: 500;
	}

	.chapter-info {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}

	.history-date {
		font-size: 0.75rem;
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
	}

	.browse-link {
		padding: var(--spacing-sm) var(--spacing-lg);
		background-color: var(--color-primary);
		color: white;
		font-weight: 500;
		border-radius: var(--radius-md);
	}
</style>
