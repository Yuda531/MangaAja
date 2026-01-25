<script lang="ts">
	import type { MangaWithGenres } from '$lib/types';
	import MangaCard from './MangaCard.svelte';

	interface Props {
		manga: MangaWithGenres[];
		title?: string;
	}

	let { manga, title }: Props = $props();

	let containerRef: HTMLDivElement;

	function scrollLeft() {
		containerRef?.scrollBy({ left: -300, behavior: 'smooth' });
	}

	function scrollRight() {
		containerRef?.scrollBy({ left: 300, behavior: 'smooth' });
	}
</script>

<div class="carousel-section">
	{#if title}
		<div class="carousel-header">
			<h2 class="section-title">{title}</h2>
			<div class="carousel-controls">
				<button class="scroll-btn" onclick={scrollLeft} aria-label="Scroll left">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M15 18l-6-6 6-6"/>
					</svg>
				</button>
				<button class="scroll-btn" onclick={scrollRight} aria-label="Scroll right">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M9 18l6-6-6-6"/>
					</svg>
				</button>
			</div>
		</div>
	{/if}

	<div class="carousel-container" bind:this={containerRef}>
		<div class="carousel-track">
			{#each manga as m (m.id)}
				<div class="carousel-item">
					<MangaCard manga={m} />
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.carousel-section {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.carousel-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.section-title {
		font-size: 1.25rem;
		font-weight: 600;
	}

	.carousel-controls {
		display: flex;
		gap: var(--spacing-sm);
	}

	.scroll-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		background-color: var(--color-bg-secondary);
		color: var(--color-text);
		border-radius: var(--radius-md);
		transition: all var(--transition-fast);
	}

	.scroll-btn:hover {
		background-color: var(--color-primary);
	}

	.carousel-container {
		overflow-x: auto;
		overflow-y: hidden;
		scroll-snap-type: x mandatory;
		scrollbar-width: none;
		-ms-overflow-style: none;
		margin: 0 calc(-1 * var(--spacing-md));
		padding: 0 var(--spacing-md);
	}

	.carousel-container::-webkit-scrollbar {
		display: none;
	}

	.carousel-track {
		display: flex;
		gap: var(--spacing-md);
	}

	.carousel-item {
		flex: 0 0 140px;
		scroll-snap-align: start;
	}

	@media (min-width: 480px) {
		.carousel-item {
			flex: 0 0 160px;
		}
	}

	@media (min-width: 768px) {
		.carousel-item {
			flex: 0 0 180px;
		}
	}
</style>
