<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import MangaGrid from '$lib/components/manga/MangaGrid.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function updateFilter(key: string, value: string | null) {
		const params = new URLSearchParams($page.url.searchParams);
		
		if (value) {
			params.set(key, value);
		} else {
			params.delete(key);
		}
		
		// Reset page when filter changes
		if (key !== 'page') {
			params.delete('page');
		}

		goto(`/browse?${params.toString()}`);
	}

	function goToPage(pageNum: number) {
		updateFilter('page', pageNum.toString());
	}
</script>

<svelte:head>
	<title>Browse Manga | MangaAja</title>
	<meta name="description" content="Browse and discover manga on MangaAja" />
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
			<h1 class="page-title">Browse</h1>
		</div>
	</header>

	<main class="main">
		<div class="container">
			<!-- Filters -->
			<div class="filters">
				<!-- Genre Filter -->
				<div class="filter-group">
					<label class="filter-label">Genre</label>
					<div class="filter-chips">
						<button 
							class="filter-chip"
							class:active={!data.filters.genre}
							onclick={() => updateFilter('genre', null)}
						>
							All
						</button>
						{#each data.genres as genre}
							<button 
								class="filter-chip"
								class:active={data.filters.genre === genre.slug}
								onclick={() => updateFilter('genre', genre.slug)}
							>
								{genre.name}
							</button>
						{/each}
					</div>
				</div>

				<!-- Status Filter -->
				<div class="filter-group">
					<label class="filter-label">Status</label>
					<div class="filter-chips">
						<button 
							class="filter-chip"
							class:active={!data.filters.status}
							onclick={() => updateFilter('status', null)}
						>
							All
						</button>
						<button 
							class="filter-chip"
							class:active={data.filters.status === 'ongoing'}
							onclick={() => updateFilter('status', 'ongoing')}
						>
							Ongoing
						</button>
						<button 
							class="filter-chip"
							class:active={data.filters.status === 'completed'}
							onclick={() => updateFilter('status', 'completed')}
						>
							Completed
						</button>
					</div>
				</div>

				<!-- Sort -->
				<div class="filter-group">
					<label class="filter-label">Sort by</label>
					<select 
						class="sort-select"
						value={data.filters.sort || 'latest'}
						onchange={(e) => updateFilter('sort', e.currentTarget.value)}
					>
						<option value="latest">Latest Update</option>
						<option value="title">Title (A-Z)</option>
					</select>
				</div>
			</div>

			<!-- Results -->
			<div class="results">
				<p class="results-count">{data.pagination.total} manga found</p>
				<MangaGrid manga={data.manga} />
			</div>

			<!-- Pagination -->
			{#if data.pagination.totalPages > 1}
				<nav class="pagination">
					<button 
						class="page-btn"
						disabled={data.pagination.page <= 1}
						onclick={() => goToPage(data.pagination.page - 1)}
					>
						Previous
					</button>

					<span class="page-info">
						Page {data.pagination.page} of {data.pagination.totalPages}
					</span>

					<button 
						class="page-btn"
						disabled={data.pagination.page >= data.pagination.totalPages}
						onclick={() => goToPage(data.pagination.page + 1)}
					>
						Next
					</button>
				</nav>
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

	.filters {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
		margin-bottom: var(--spacing-xl);
		padding: var(--spacing-lg);
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-xl);
	}

	.filter-group {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.filter-label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-secondary);
	}

	.filter-chips {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-sm);
	}

	.filter-chip {
		padding: var(--spacing-sm) var(--spacing-md);
		background-color: var(--color-bg-tertiary);
		color: var(--color-text-secondary);
		font-size: 0.875rem;
		border-radius: var(--radius-lg);
		transition: all var(--transition-fast);
	}

	.filter-chip:hover {
		background-color: var(--color-border);
	}

	.filter-chip.active {
		background-color: var(--color-primary);
		color: white;
	}

	.sort-select {
		padding: var(--spacing-sm) var(--spacing-md);
		background-color: var(--color-bg-tertiary);
		color: var(--color-text);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: 0.875rem;
		cursor: pointer;
	}

	.results {
		margin-bottom: var(--spacing-xl);
	}

	.results-count {
		color: var(--color-text-muted);
		font-size: 0.875rem;
		margin-bottom: var(--spacing-md);
	}

	.pagination {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-lg);
	}

	.page-btn {
		padding: var(--spacing-sm) var(--spacing-lg);
		background-color: var(--color-bg-secondary);
		color: var(--color-text);
		font-weight: 500;
		border-radius: var(--radius-md);
		transition: all var(--transition-fast);
	}

	.page-btn:hover:not(:disabled) {
		background-color: var(--color-primary);
	}

	.page-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.page-info {
		color: var(--color-text-secondary);
		font-size: 0.875rem;
	}
</style>
