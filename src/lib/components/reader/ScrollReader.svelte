<script lang="ts">
	import { onMount } from 'svelte';
	import { currentPage } from '$lib/stores/reader';
	import type { Page } from '$lib/types';

	interface Props {
		pages: Page[];
	}

	let { pages }: Props = $props();

	let containerRef: HTMLDivElement;
	let pageRefs: HTMLDivElement[] = [];
	let loadedImages = $state<Set<number>>(new Set());

	// Intersection Observer for lazy loading
	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const pageNum = parseInt(entry.target.getAttribute('data-page') || '0');
						if (pageNum > 0) {
							loadedImages = new Set([...loadedImages, pageNum]);
							
							// Update current page based on scroll position
							currentPage.set(pageNum);
						}
					}
				});
			},
			{
				root: containerRef,
				rootMargin: '100px',
				threshold: 0.5
			}
		);

		pageRefs.forEach((ref) => {
			if (ref) observer.observe(ref);
		});

		return () => observer.disconnect();
	});

	function handleImageLoad(pageNumber: number) {
		loadedImages = new Set([...loadedImages, pageNumber]);
	}
</script>

<div class="scroll-reader" bind:this={containerRef}>
	{#each pages as page, index (page.id)}
		<div 
			class="page-wrapper"
			bind:this={pageRefs[index]}
			data-page={page.pageNumber}
		>
			{#if loadedImages.has(page.pageNumber) || index < 3}
				<img
					src={page.imageUrl}
					alt="Page {page.pageNumber}"
					class="page-image"
					loading="lazy"
					onload={() => handleImageLoad(page.pageNumber)}
					draggable="false"
				/>
			{:else}
				<div 
					class="page-placeholder"
					style="aspect-ratio: {page.width && page.height ? `${page.width}/${page.height}` : '2/3'}"
				>
					<span class="page-number">Page {page.pageNumber}</span>
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.scroll-reader {
		height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		scroll-behavior: smooth;
	}

	.page-wrapper {
		display: flex;
		justify-content: center;
		min-height: 100px;
		margin-bottom: var(--spacing-xs);
	}

	.page-image {
		max-width: 100%;
		height: auto;
		display: block;
	}

	.page-placeholder {
		width: 100%;
		max-width: 800px;
		background-color: var(--color-bg-secondary);
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-md);
	}

	.page-number {
		color: var(--color-text-muted);
		font-size: 0.875rem;
	}
</style>
