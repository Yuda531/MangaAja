<script lang="ts">
	import type { MangaWithGenres } from '$lib/types';

	interface Props {
		manga: MangaWithGenres;
		showLatestChapter?: boolean;
	}

	let { manga, showLatestChapter = true }: Props = $props();

	let imageLoaded = $state(false);
	let imageError = $state(false);

	function formatDate(date: Date): string {
		const now = new Date();
		const diff = now.getTime() - new Date(date).getTime();
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));

		if (days === 0) return 'Today';
		if (days === 1) return 'Yesterday';
		if (days < 7) return `${days} days ago`;
		if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
		return new Date(date).toLocaleDateString();
	}
</script>

<a href="/manga/{manga.slug}" class="manga-card">
	<div class="cover-wrapper">
		{#if manga.coverUrl && !imageError}
			<img
				src={manga.coverUrl}
				alt={manga.title}
				class="cover-image"
				class:loaded={imageLoaded}
				loading="lazy"
				onload={() => imageLoaded = true}
				onerror={() => imageError = true}
			/>
		{:else}
			<div class="cover-placeholder">
				<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
					<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
					<circle cx="8.5" cy="8.5" r="1.5"/>
					<polyline points="21 15 16 10 5 21"/>
				</svg>
			</div>
		{/if}

		{#if manga.status === 'completed'}
			<span class="status-badge status-badge--completed">Completed</span>
		{:else if manga.status === 'hiatus'}
			<span class="status-badge status-badge--hiatus">Hiatus</span>
		{/if}
	</div>

	<div class="card-info">
		<h3 class="title">{manga.title}</h3>

		{#if manga.genres.length > 0}
			<div class="genres">
				{#each manga.genres.slice(0, 2) as genre}
					<span class="genre-tag">{genre.name}</span>
				{/each}
			</div>
		{/if}

		{#if showLatestChapter}
			<p class="update-time">{formatDate(manga.updatedAt)}</p>
		{/if}
	</div>
</a>

<style>
	.manga-card {
		display: flex;
		flex-direction: column;
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-lg);
		overflow: hidden;
		transition: transform var(--transition-fast), box-shadow var(--transition-fast);
	}

	.manga-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
	}

	.cover-wrapper {
		position: relative;
		aspect-ratio: 2/3;
		background-color: var(--color-bg-tertiary);
		overflow: hidden;
	}

	.cover-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0;
		transition: opacity var(--transition-normal);
	}

	.cover-image.loaded {
		opacity: 1;
	}

	.cover-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		color: var(--color-text-muted);
	}

	.status-badge {
		position: absolute;
		top: var(--spacing-sm);
		right: var(--spacing-sm);
		padding: var(--spacing-xs) var(--spacing-sm);
		font-size: 0.625rem;
		font-weight: 600;
		text-transform: uppercase;
		border-radius: var(--radius-sm);
	}

	.status-badge--completed {
		background-color: var(--color-success);
		color: white;
	}

	.status-badge--hiatus {
		background-color: var(--color-warning);
		color: black;
	}

	.card-info {
		padding: var(--spacing-md);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	.title {
		font-size: 0.875rem;
		font-weight: 600;
		line-height: 1.3;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.genres {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-xs);
	}

	.genre-tag {
		font-size: 0.625rem;
		padding: 2px 6px;
		background-color: var(--color-bg-tertiary);
		color: var(--color-text-secondary);
		border-radius: var(--radius-sm);
	}

	.update-time {
		font-size: 0.75rem;
		color: var(--color-text-muted);
	}
</style>
