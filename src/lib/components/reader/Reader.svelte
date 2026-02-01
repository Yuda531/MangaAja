<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import PageReader from './PageReader.svelte';
	import ScrollReader from './ScrollReader.svelte';
	import ReaderControls from './ReaderControls.svelte';
	import ReaderSettings from './ReaderSettings.svelte';
	import ChapterNav from './ChapterNav.svelte';
	import { readerSettings, currentPage, chapterState, totalPages } from '$lib/stores/reader';
	import type { ChapterWithPages, Chapter, Manga } from '$lib/types';

	interface Props {
		chapter: ChapterWithPages;
		manga: Manga;
		prevChapter: Chapter | null;
		nextChapter: Chapter | null;
		isLoggedIn?: boolean;
	}

	let { chapter, manga, prevChapter, nextChapter, isLoggedIn = false }: Props = $props();

	let showSettings = $state(false);
	let showControls = $state(true);
	let controlsTimeout: ReturnType<typeof setTimeout>;
	let progressSaveTimeout: ReturnType<typeof setTimeout>;
	let lastSavedPage = $state(0);

	// Initialize chapter state
	$effect(() => {
		chapterState.setChapter({
			chapter,
			manga,
			navigation: { prev: prevChapter, next: nextChapter }
		});
		currentPage.set(1);
	});

	// Save reading progress when page changes (debounced)
	$effect(() => {
		const page = $currentPage;
		if (isLoggedIn && page > 0 && page !== lastSavedPage) {
			clearTimeout(progressSaveTimeout);
			progressSaveTimeout = setTimeout(() => {
				saveProgress(page);
			}, 2000); // Save after 2 seconds of no page changes
		}
	});

	async function saveProgress(pageNumber: number) {
		try {
			await fetch('/api/progress', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					mangaId: manga.id,
					chapterId: chapter.id,
					pageNumber
				})
			});
			lastSavedPage = pageNumber;
		} catch (err) {
			console.error('Failed to save progress:', err);
		}
	}

	// Initialize settings from localStorage
	onMount(() => {
		readerSettings.init();
	});

	// Keyboard navigation
	function handleKeydown(e: KeyboardEvent) {
		if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
			return;
		}

		switch (e.key) {
			case 'ArrowLeft':
				e.preventDefault();
				currentPage.prev();
				break;
			case 'ArrowRight':
				e.preventDefault();
				currentPage.next($totalPages);
				break;
			case 'Escape':
				showSettings = false;
				break;
		}
	}

	// Auto-hide controls
	function showControlsTemporarily() {
		showControls = true;
		clearTimeout(controlsTimeout);
		controlsTimeout = setTimeout(() => {
			showControls = false;
		}, 3000);
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		showControlsTemporarily();
		return () => {
			window.removeEventListener('keydown', handleKeydown);
			clearTimeout(controlsTimeout);
			clearTimeout(progressSaveTimeout);
			
			// Save progress when leaving the page
			if (isLoggedIn && $currentPage > 0 && $currentPage !== lastSavedPage) {
				saveProgress($currentPage);
			}
		};
	});

	function handleMouseMove() {
		showControlsTemporarily();
	}

	function toggleSettings() {
		showSettings = !showSettings;
	}
</script>

<div 
	class="reader" 
	onmousemove={handleMouseMove}
	style="--brightness: {$readerSettings.brightness}%"
>
	{#if $readerSettings.mode === 'page'}
		<PageReader pages={chapter.pages} />
	{:else}
		<ScrollReader pages={chapter.pages} />
	{/if}

	<ReaderControls 
		visible={showControls}
		onSettingsClick={toggleSettings}
	/>

	<ChapterNav 
		{manga}
		{prevChapter}
		{nextChapter}
		currentChapter={chapter}
	/>

	{#if showSettings}
		<ReaderSettings onClose={() => showSettings = false} />
	{/if}
</div>

<style>
	.reader {
		position: fixed;
		inset: 0;
		background-color: var(--color-bg);
		filter: brightness(var(--brightness));
		overflow: hidden;
	}
</style>
