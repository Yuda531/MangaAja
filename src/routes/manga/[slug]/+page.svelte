<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let showFullDescription = $state(false);
	let sortAsc = $state(false);
	let imageLoaded = $state(false);

	let sortedChapters = $derived(
		sortAsc 
			? [...data.manga.chapters].sort((a, b) => a.chapterNumber - b.chapterNumber)
			: data.manga.chapters
	);

	function toggleSort() {
		sortAsc = !sortAsc;
	}

	function getReadUrl(): string {
		if (data.progress) {
			// Find the chapter from progress
			const chapter = data.manga.chapters.find(c => c.id === data.progress?.chapterId);
			if (chapter) {
				return `/read/${data.manga.slug}/${chapter.chapterNumber}`;
			}
		}
		// Start from first chapter
		const firstChapter = data.manga.chapters[data.manga.chapters.length - 1];
		return firstChapter ? `/read/${data.manga.slug}/${firstChapter.chapterNumber}` : '#';
	}

	async function toggleBookmark() {
		// TODO: Implement bookmark toggle with API
	}
</script>

<svelte:head>
	<title>{data.manga.title} | MangaAja</title>
	<meta name="description" content={data.manga.description || `Read ${data.manga.title} online`} />
</svelte:head>

<div class="page">
	<header class="header">
		<div class="container">
			<a href="/" class="back-link">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M19 12H5M12 19l-7-7 7-7"/>
				</svg>
				<span>Back</span>
			</a>
		</div>
	</header>

	<main class="main">
		<div class="container">
			<!-- Manga Info Section -->
			<section class="manga-info">
				<div class="cover-wrapper">
					{#if data.manga.coverUrl}
						<img
							src={data.manga.coverUrl}
							alt={data.manga.title}
							class="cover-image"
							class:loaded={imageLoaded}
							onload={() => imageLoaded = true}
						/>
					{:else}
						<div class="cover-placeholder">
							<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
								<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
								<circle cx="8.5" cy="8.5" r="1.5"/>
								<polyline points="21 15 16 10 5 21"/>
							</svg>
						</div>
					{/if}
				</div>

				<div class="info-content">
					<h1 class="title">{data.manga.title}</h1>

					<div class="meta">
						<span class="status status--{data.manga.status}">{data.manga.status}</span>
						<span class="chapter-count">{data.manga.chapters.length} Chapters</span>
					</div>

					{#if data.manga.genres.length > 0}
						<div class="genres">
							{#each data.manga.genres as genre}
								<a href="/browse?genre={genre.slug}" class="genre-tag">{genre.name}</a>
							{/each}
						</div>
					{/if}

					{#if data.manga.description}
						<div class="description" class:expanded={showFullDescription}>
							<p>{data.manga.description}</p>
							<button class="expand-btn" onclick={() => showFullDescription = !showFullDescription}>
								{showFullDescription ? 'Show less' : 'Show more'}
							</button>
						</div>
					{/if}

					<div class="actions">
						<a href={getReadUrl()} class="read-btn">
							{#if data.progress}
								Continue Reading
							{:else}
								Start Reading
							{/if}
						</a>
						<button class="bookmark-btn" class:bookmarked={data.bookmarked} onclick={toggleBookmark}>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={data.bookmarked ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
							</svg>
						</button>
					</div>
				</div>
			</section>

			<!-- Chapters Section -->
			<section class="chapters-section">
				<div class="chapters-header">
					<h2 class="chapters-title">Chapters</h2>
					<button class="sort-btn" onclick={toggleSort}>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							{#if sortAsc}
								<path d="M12 5v14M5 12l7-7 7 7"/>
							{:else}
								<path d="M12 19V5M5 12l7 7 7-7"/>
							{/if}
						</svg>
						{sortAsc ? 'Oldest first' : 'Newest first'}
					</button>
				</div>

				<div class="chapters-list">
					{#each sortedChapters as chapter (chapter.id)}
						<a href="/read/{data.manga.slug}/{chapter.chapterNumber}" class="chapter-item">
							<span class="chapter-number">Chapter {chapter.chapterNumber}</span>
							{#if chapter.title}
								<span class="chapter-title">{chapter.title}</span>
							{/if}
							<span class="chapter-date">
								{new Date(chapter.createdAt).toLocaleDateString()}
							</span>
						</a>
					{/each}

					{#if data.manga.chapters.length === 0}
						<div class="empty-chapters">
							<p>No chapters available</p>
						</div>
					{/if}
				</div>
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

	.main {
		padding: var(--spacing-xl) 0;
	}

	.manga-info {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xl);
		margin-bottom: var(--spacing-2xl);
	}

	@media (min-width: 768px) {
		.manga-info {
			flex-direction: row;
		}
	}

	.cover-wrapper {
		width: 200px;
		flex-shrink: 0;
		align-self: center;
	}

	@media (min-width: 768px) {
		.cover-wrapper {
			width: 250px;
			align-self: flex-start;
		}
	}

	.cover-image {
		width: 100%;
		border-radius: var(--radius-lg);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
		opacity: 0;
		transition: opacity var(--transition-normal);
	}

	.cover-image.loaded {
		opacity: 1;
	}

	.cover-placeholder {
		aspect-ratio: 2/3;
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-lg);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text-muted);
	}

	.info-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.title {
		font-size: 1.75rem;
		font-weight: 700;
		line-height: 1.2;
	}

	@media (min-width: 768px) {
		.title {
			font-size: 2rem;
		}
	}

	.meta {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
	}

	.status {
		padding: var(--spacing-xs) var(--spacing-sm);
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		border-radius: var(--radius-sm);
	}

	.status--ongoing {
		background-color: var(--color-primary);
		color: white;
	}

	.status--completed {
		background-color: var(--color-success);
		color: white;
	}

	.status--hiatus {
		background-color: var(--color-warning);
		color: black;
	}

	.chapter-count {
		color: var(--color-text-secondary);
		font-size: 0.875rem;
	}

	.genres {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-sm);
	}

	.genre-tag {
		padding: var(--spacing-xs) var(--spacing-md);
		background-color: var(--color-bg-secondary);
		color: var(--color-text-secondary);
		font-size: 0.875rem;
		border-radius: var(--radius-md);
		transition: all var(--transition-fast);
	}

	.genre-tag:hover {
		background-color: var(--color-primary);
		color: var(--color-text);
	}

	.description {
		position: relative;
		max-height: 4.5em;
		overflow: hidden;
		color: var(--color-text-secondary);
		line-height: 1.5;
	}

	.description.expanded {
		max-height: none;
	}

	.expand-btn {
		display: block;
		margin-top: var(--spacing-sm);
		color: var(--color-primary);
		font-size: 0.875rem;
		font-weight: 500;
	}

	.actions {
		display: flex;
		gap: var(--spacing-md);
		margin-top: var(--spacing-md);
	}

	.read-btn {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--spacing-md) var(--spacing-xl);
		background-color: var(--color-primary);
		color: white;
		font-weight: 600;
		border-radius: var(--radius-lg);
		transition: background-color var(--transition-fast);
	}

	.read-btn:hover {
		background-color: var(--color-primary-hover);
	}

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

	.bookmark-btn:hover {
		background-color: var(--color-bg-tertiary);
	}

	.bookmark-btn.bookmarked {
		color: var(--color-primary);
	}

	.chapters-section {
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-xl);
		padding: var(--spacing-lg);
	}

	.chapters-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--spacing-lg);
	}

	.chapters-title {
		font-size: 1.125rem;
		font-weight: 600;
	}

	.sort-btn {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		padding: var(--spacing-sm) var(--spacing-md);
		background-color: var(--color-bg-tertiary);
		color: var(--color-text-secondary);
		font-size: 0.875rem;
		border-radius: var(--radius-md);
		transition: all var(--transition-fast);
	}

	.sort-btn:hover {
		background-color: var(--color-border);
		color: var(--color-text);
	}

	.chapters-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
		max-height: 500px;
		overflow-y: auto;
	}

	.chapter-item {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		padding: var(--spacing-md);
		background-color: var(--color-bg-tertiary);
		border-radius: var(--radius-md);
		transition: background-color var(--transition-fast);
	}

	.chapter-item:hover {
		background-color: var(--color-border);
	}

	.chapter-number {
		font-weight: 600;
		white-space: nowrap;
	}

	.chapter-title {
		flex: 1;
		color: var(--color-text-secondary);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.chapter-date {
		font-size: 0.75rem;
		color: var(--color-text-muted);
		white-space: nowrap;
	}

	.empty-chapters {
		text-align: center;
		padding: var(--spacing-2xl);
		color: var(--color-text-muted);
	}
</style>
