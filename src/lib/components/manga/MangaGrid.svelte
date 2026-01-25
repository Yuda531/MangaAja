<script lang="ts">
	import type { MangaWithGenres } from '$lib/types';
	import MangaCard from './MangaCard.svelte';

	interface Props {
		manga: MangaWithGenres[];
		loading?: boolean;
		columns?: number;
	}

	let { manga, loading = false, columns = 5 }: Props = $props();
</script>

<div class="manga-grid" style="--columns: {columns}">
	{#if loading}
		{#each Array(10) as _}
			<div class="skeleton-card">
				<div class="skeleton-cover"></div>
				<div class="skeleton-info">
					<div class="skeleton-title"></div>
					<div class="skeleton-meta"></div>
				</div>
			</div>
		{/each}
	{:else if manga.length === 0}
		<div class="empty-state">
			<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
				<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
				<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
			</svg>
			<p>No manga found</p>
		</div>
	{:else}
		{#each manga as m (m.id)}
			<MangaCard manga={m} />
		{/each}
	{/if}
</div>

<style>
	.manga-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--spacing-md);
	}

	@media (min-width: 480px) {
		.manga-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (min-width: 768px) {
		.manga-grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.manga-grid {
			grid-template-columns: repeat(var(--columns), 1fr);
		}
	}

	.skeleton-card {
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-lg);
		overflow: hidden;
	}

	.skeleton-cover {
		aspect-ratio: 2/3;
		background: linear-gradient(
			90deg,
			var(--color-bg-tertiary) 25%,
			var(--color-bg-secondary) 50%,
			var(--color-bg-tertiary) 75%
		);
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite;
	}

	.skeleton-info {
		padding: var(--spacing-md);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.skeleton-title {
		height: 1rem;
		background-color: var(--color-bg-tertiary);
		border-radius: var(--radius-sm);
	}

	.skeleton-meta {
		height: 0.75rem;
		width: 60%;
		background-color: var(--color-bg-tertiary);
		border-radius: var(--radius-sm);
	}

	@keyframes shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	.empty-state {
		grid-column: 1 / -1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-md);
		padding: var(--spacing-2xl);
		color: var(--color-text-muted);
	}
</style>
