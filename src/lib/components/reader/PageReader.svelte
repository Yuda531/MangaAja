<script lang="ts">
	import { currentPage, totalPages, hasNextPage, hasPrevPage, preloadImages, getPreloadUrls } from '$lib/stores/reader';
	import type { Page } from '$lib/types';

	interface Props {
		pages: Page[];
	}

	let { pages }: Props = $props();

	let imageLoaded = $state(false);
	let imageError = $state(false);

	// Current page data
	let currentPageData = $derived(pages[$currentPage - 1]);

	// Preload next pages when current page changes
	$effect(() => {
		const urls = getPreloadUrls(pages, $currentPage, 2);
		preloadImages(urls);
	});

	// Reset loading state on page change
	$effect(() => {
		$currentPage;
		imageLoaded = false;
		imageError = false;
	});

	function handlePrevClick() {
		if ($hasPrevPage) {
			currentPage.prev();
		}
	}

	function handleNextClick() {
		if ($hasNextPage) {
			currentPage.next($totalPages);
		}
	}

	function handleImageLoad() {
		imageLoaded = true;
	}

	function handleImageError() {
		imageError = true;
	}

	function handleRetry() {
		imageError = false;
		imageLoaded = false;
	}
</script>

<div class="page-reader">
	<!-- Click zones for navigation -->
	<button 
		class="nav-zone nav-zone--prev" 
		onclick={handlePrevClick}
		disabled={!$hasPrevPage}
		aria-label="Previous page"
	></button>

	<div class="page-container">
		{#if currentPageData}
			{#if !imageLoaded && !imageError}
				<div class="loading-skeleton">
					<div class="spinner"></div>
				</div>
			{/if}

			{#if imageError}
				<div class="error-state">
					<p>Failed to load image</p>
					<button class="retry-btn" onclick={handleRetry}>Retry</button>
				</div>
			{:else}
				<img
					src={currentPageData.imageUrl}
					alt="Page {currentPageData.pageNumber}"
					class="page-image"
					class:loaded={imageLoaded}
					onload={handleImageLoad}
					onerror={handleImageError}
					draggable="false"
				/>
			{/if}
		{/if}
	</div>

	<button 
		class="nav-zone nav-zone--next" 
		onclick={handleNextClick}
		disabled={!$hasNextPage}
		aria-label="Next page"
	></button>
</div>

<style>
	.page-reader {
		display: flex;
		height: 100%;
		width: 100%;
		position: relative;
	}

	.nav-zone {
		position: absolute;
		top: 0;
		height: 100%;
		width: 25%;
		background: transparent;
		border: none;
		cursor: pointer;
		z-index: 10;
		transition: background-color var(--transition-fast);
	}

	.nav-zone:hover:not(:disabled) {
		background-color: rgba(255, 255, 255, 0.05);
	}

	.nav-zone:disabled {
		cursor: default;
	}

	.nav-zone--prev {
		left: 0;
	}

	.nav-zone--next {
		right: 0;
	}

	.page-container {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--spacing-md);
		overflow: hidden;
	}

	.page-image {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		opacity: 0;
		transition: opacity var(--transition-normal);
	}

	.page-image.loaded {
		opacity: 1;
	}

	.loading-skeleton {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-md);
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 3px solid var(--color-border);
		border-top-color: var(--color-primary);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.error-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-md);
		color: var(--color-text-secondary);
	}

	.retry-btn {
		padding: var(--spacing-sm) var(--spacing-lg);
		background-color: var(--color-primary);
		color: var(--color-text);
		border-radius: var(--radius-md);
		font-weight: 500;
		transition: background-color var(--transition-fast);
	}

	.retry-btn:hover {
		background-color: var(--color-primary-hover);
	}
</style>
