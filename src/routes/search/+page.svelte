<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let searchQuery = $state(data.query);

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (searchQuery.trim()) {
			goto(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
		}
	}
</script>

<svelte:head>
	<title>{data.query ? `Search: ${data.query}` : 'Search'} | MangaAja</title>
</svelte:head>

<div class="page">
	<header class="header">
		<div class="container">
			<a href="/" class="back-link">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M19 12H5M12 19l-7-7 7-7"/>
				</svg>
			</a>
			<form class="search-form" onsubmit={handleSubmit}>
				<input
					type="search"
					bind:value={searchQuery}
					placeholder="Search manga..."
					class="search-input"
					autofocus
				/>
			</form>
		</div>
	</header>

	<main class="main">
		<div class="container">
			{#if data.query}
				<p class="results-info">
					{data.results.length} results for "{data.query}"
				</p>
			{/if}

			{#if data.results.length === 0 && data.query}
				<div class="empty-state">
					<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="11" cy="11" r="8"/>
						<path d="M21 21l-4.35-4.35"/>
					</svg>
					<p>No results found</p>
					<p class="hint">Try a different search term</p>
				</div>
			{:else if data.results.length > 0}
				<div class="results-list">
					{#each data.results as manga (manga.id)}
						<a href="/manga/{manga.slug}" class="result-item">
							{#if manga.coverUrl}
								<img src={manga.coverUrl} alt="" class="result-cover" loading="lazy" />
							{:else}
								<div class="result-cover-placeholder"></div>
							{/if}
							<div class="result-info">
								<h2 class="result-title">{manga.title}</h2>
								{#if manga.description}
									<p class="result-description">{manga.description}</p>
								{/if}
							</div>
						</a>
					{/each}
				</div>
			{:else}
				<div class="empty-state">
					<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="11" cy="11" r="8"/>
						<path d="M21 21l-4.35-4.35"/>
					</svg>
					<p>Search for manga</p>
				</div>
			{/if}
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
		gap: var(--spacing-md);
	}

	.back-link {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		color: var(--color-text-secondary);
		transition: color var(--transition-fast);
	}

	.back-link:hover {
		color: var(--color-text);
	}

	.search-form {
		flex: 1;
	}

	.search-input {
		width: 100%;
		padding: var(--spacing-sm) var(--spacing-md);
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		color: var(--color-text);
		font-size: 1rem;
		outline: none;
	}

	.search-input:focus {
		border-color: var(--color-primary);
	}

	.main {
		padding: var(--spacing-xl) 0;
	}

	.results-info {
		color: var(--color-text-secondary);
		margin-bottom: var(--spacing-lg);
	}

	.results-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.result-item {
		display: flex;
		gap: var(--spacing-md);
		padding: var(--spacing-md);
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-lg);
		transition: background-color var(--transition-fast);
	}

	.result-item:hover {
		background-color: var(--color-bg-tertiary);
	}

	.result-cover {
		width: 80px;
		height: 120px;
		object-fit: cover;
		border-radius: var(--radius-md);
		flex-shrink: 0;
	}

	.result-cover-placeholder {
		width: 80px;
		height: 120px;
		background-color: var(--color-bg-tertiary);
		border-radius: var(--radius-md);
		flex-shrink: 0;
	}

	.result-info {
		flex: 1;
		min-width: 0;
	}

	.result-title {
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: var(--spacing-xs);
	}

	.result-description {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
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

	.hint {
		font-size: 0.875rem;
	}
</style>
