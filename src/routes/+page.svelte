<script lang="ts">
	import MangaCarousel from '$lib/components/manga/MangaCarousel.svelte';
	import MangaGrid from '$lib/components/manga/MangaGrid.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>MangaAja - Read Manga Online</title>
	<meta name="description" content="Read your favorite manga online for free. Latest updates, popular titles, and more." />
</svelte:head>

<div class="page">
	<main class="main">
		<!-- Hero Section -->
		{#if data.featured.length > 0}
			<section class="hero">
				<div class="container">
					<div class="hero-content">
					<div class="hero-info">
						<span class="hero-badge">Featured</span>
						<h1 class="hero-title">{data.featured[0].title}</h1>
						{#if data.featured[0].description}
							<p class="hero-description">{data.featured[0].description}</p>
						{/if}
						<div class="hero-genres">
							{#each data.featured[0].genres.slice(0, 3) as genre}
								<span class="genre-tag">{genre.name}</span>
							{/each}
						</div>
						<a href="/manga/{data.featured[0].slug}" class="hero-cta">Start Reading</a>
					</div>
					{#if data.featured[0].coverUrl}
						<div class="hero-cover">
							<img src={data.featured[0].coverUrl} alt={data.featured[0].title} />
						</div>
					{/if}
				</div>
				</div>
			</section>
		{/if}

		<!-- Popular Manga Carousel -->
		{#if data.featured.length > 1}
			<section class="section">
				<div class="container">
					<MangaCarousel manga={data.featured} title="Popular Now" />
				</div>
			</section>
		{/if}

		<!-- Latest Updates -->
		<section class="section">
			<div class="container">
				<div class="section-header">
					<h2 class="section-title">Latest Updates</h2>
					<a href="/browse?sort=latest" class="view-all">View All</a>
				</div>
				<MangaGrid manga={data.latest} />
			</div>
		</section>

		<!-- Genre Quick Links -->
		{#if data.genres.length > 0}
			<section class="section">
				<div class="container">
					<h2 class="section-title">Browse by Genre</h2>
					<div class="genre-links">
						{#each data.genres as genre}
							<a href="/browse?genre={genre.slug}" class="genre-link">
								{genre.name}
							</a>
						{/each}
					</div>
				</div>
			</section>
		{/if}
	</main>

	<footer class="footer">
		<div class="container">
			<p class="footer-text">MangaAja - Read manga online for free</p>
		</div>
	</footer>
</div>

<style>
	.page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.main {
		flex: 1;
	}

	.hero {
		background: linear-gradient(135deg, var(--color-bg-secondary), var(--color-bg));
		padding: var(--spacing-2xl) 0;
	}

	.hero-content {
		display: flex;
		flex-direction: column-reverse;
		gap: var(--spacing-xl);
	}

	@media (min-width: 768px) {
		.hero-content {
			flex-direction: row;
			align-items: center;
		}
	}

	.hero-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.hero-badge {
		display: inline-block;
		width: fit-content;
		padding: var(--spacing-xs) var(--spacing-sm);
		background-color: var(--color-primary);
		color: white;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		border-radius: var(--radius-sm);
	}

	.hero-title {
		font-size: 2rem;
		font-weight: 700;
		line-height: 1.2;
	}

	@media (min-width: 768px) {
		.hero-title {
			font-size: 2.5rem;
		}
	}

	.hero-description {
		color: var(--color-text-secondary);
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.hero-genres {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-sm);
	}

	.genre-tag {
		padding: var(--spacing-xs) var(--spacing-md);
		background-color: var(--color-bg-tertiary);
		color: var(--color-text-secondary);
		font-size: 0.875rem;
		border-radius: var(--radius-md);
	}

	.hero-cta {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: fit-content;
		padding: var(--spacing-md) var(--spacing-xl);
		background-color: var(--color-primary);
		color: white;
		font-weight: 600;
		border-radius: var(--radius-lg);
		transition: background-color var(--transition-fast);
	}

	.hero-cta:hover {
		background-color: var(--color-primary-hover);
	}

	.hero-cover {
		width: 200px;
		flex-shrink: 0;
	}

	@media (min-width: 768px) {
		.hero-cover {
			width: 250px;
		}
	}

	.hero-cover img {
		width: 100%;
		border-radius: var(--radius-lg);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	}

	.section {
		padding: var(--spacing-2xl) 0;
	}

	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--spacing-lg);
	}

	.section-title {
		font-size: 1.25rem;
		font-weight: 600;
	}

	.view-all {
		font-size: 0.875rem;
		color: var(--color-primary);
		font-weight: 500;
	}

	.genre-links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-sm);
	}

	.genre-link {
		padding: var(--spacing-sm) var(--spacing-lg);
		background-color: var(--color-bg-secondary);
		color: var(--color-text);
		font-size: 0.875rem;
		border-radius: var(--radius-lg);
		transition: all var(--transition-fast);
	}

	.genre-link:hover {
		background-color: var(--color-primary);
	}

	.footer {
		padding: var(--spacing-xl) 0;
		padding-bottom: calc(var(--spacing-xl) + var(--safe-area-bottom));
		border-top: 1px solid var(--color-border);
	}

	.footer-text {
		text-align: center;
		color: var(--color-text-muted);
		font-size: 0.875rem;
	}
</style>
