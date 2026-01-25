<script lang="ts">
	import type { Chapter, Manga } from '$lib/types';

	interface Props {
		manga: Manga;
		currentChapter: Chapter;
		prevChapter: Chapter | null;
		nextChapter: Chapter | null;
	}

	let { manga, currentChapter, prevChapter, nextChapter }: Props = $props();

	let showDropdown = $state(false);

	function toggleDropdown() {
		showDropdown = !showDropdown;
	}
</script>

<nav class="chapter-nav">
	<!-- Previous Chapter -->
	{#if prevChapter}
		<a 
			href="/read/{manga.slug}/{prevChapter.chapterNumber}" 
			class="nav-link nav-link--prev"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M15 18l-6-6 6-6"/>
			</svg>
			<span class="nav-text">Ch. {prevChapter.chapterNumber}</span>
		</a>
	{:else}
		<div class="nav-link nav-link--disabled">
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M15 18l-6-6 6-6"/>
			</svg>
		</div>
	{/if}

	<!-- Chapter Selector -->
	<div class="chapter-selector">
		<button class="current-chapter" onclick={toggleDropdown}>
			<span>Chapter {currentChapter.chapterNumber}</span>
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M6 9l6 6 6-6"/>
			</svg>
		</button>

		<!-- Return to manga page -->
		<a href="/manga/{manga.slug}" class="manga-link">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
				<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
			</svg>
		</a>
	</div>

	<!-- Next Chapter -->
	{#if nextChapter}
		<a 
			href="/read/{manga.slug}/{nextChapter.chapterNumber}" 
			class="nav-link nav-link--next"
		>
			<span class="nav-text">Ch. {nextChapter.chapterNumber}</span>
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M9 18l6-6-6-6"/>
			</svg>
		</a>
	{:else}
		<div class="nav-link nav-link--disabled">
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M9 18l6-6-6-6"/>
			</svg>
		</div>
	{/if}
</nav>

<style>
	.chapter-nav {
		position: fixed;
		bottom: calc(80px + var(--safe-area-bottom));
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		padding: var(--spacing-sm);
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-xl);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		z-index: var(--z-sticky);
	}

	.nav-link {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		padding: var(--spacing-sm) var(--spacing-md);
		color: var(--color-text);
		background-color: var(--color-bg-tertiary);
		border-radius: var(--radius-lg);
		font-size: 0.875rem;
		font-weight: 500;
		transition: all var(--transition-fast);
		min-height: 44px;
	}

	.nav-link:hover:not(.nav-link--disabled) {
		background-color: var(--color-primary);
	}

	.nav-link--disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.nav-text {
		display: none;
	}

	@media (min-width: 480px) {
		.nav-text {
			display: inline;
		}
	}

	.chapter-selector {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
	}

	.current-chapter {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		padding: var(--spacing-sm) var(--spacing-md);
		color: var(--color-text);
		background-color: var(--color-bg-tertiary);
		border-radius: var(--radius-lg);
		font-size: 0.875rem;
		font-weight: 500;
		transition: all var(--transition-fast);
		min-height: 44px;
	}

	.current-chapter:hover {
		background-color: var(--color-border);
	}

	.manga-link {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		color: var(--color-text-secondary);
		background-color: var(--color-bg-tertiary);
		border-radius: var(--radius-lg);
		transition: all var(--transition-fast);
	}

	.manga-link:hover {
		background-color: var(--color-primary);
		color: var(--color-text);
	}
</style>
