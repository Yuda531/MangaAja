import { writable, derived, get } from 'svelte/store';
import type { ReadingMode, ReaderSettings, ChapterWithPages, Chapter, Manga } from '$lib/types';

// Default settings
const DEFAULT_SETTINGS: ReaderSettings = {
	mode: 'page',
	brightness: 100,
	fitMode: 'width'
};

// Load settings from localStorage
function loadSettings(): ReaderSettings {
	if (typeof window === 'undefined') return DEFAULT_SETTINGS;
	
	try {
		const stored = localStorage.getItem('reader-settings');
		if (stored) {
			return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
		}
	} catch {
		// Ignore parse errors
	}
	return DEFAULT_SETTINGS;
}

// Save settings to localStorage
function saveSettings(settings: ReaderSettings): void {
	if (typeof window === 'undefined') return;
	
	try {
		localStorage.setItem('reader-settings', JSON.stringify(settings));
	} catch {
		// Ignore storage errors
	}
}

// Reader settings store
function createSettingsStore() {
	const { subscribe, set, update } = writable<ReaderSettings>(DEFAULT_SETTINGS);

	return {
		subscribe,
		init: () => {
			set(loadSettings());
		},
		setMode: (mode: ReadingMode) => {
			update(s => {
				const newSettings = { ...s, mode };
				saveSettings(newSettings);
				return newSettings;
			});
		},
		setBrightness: (brightness: number) => {
			update(s => {
				const newSettings = { ...s, brightness: Math.max(50, Math.min(100, brightness)) };
				saveSettings(newSettings);
				return newSettings;
			});
		},
		setFitMode: (fitMode: ReaderSettings['fitMode']) => {
			update(s => {
				const newSettings = { ...s, fitMode };
				saveSettings(newSettings);
				return newSettings;
			});
		},
		reset: () => {
			set(DEFAULT_SETTINGS);
			saveSettings(DEFAULT_SETTINGS);
		}
	};
}

// Current page store
function createCurrentPageStore() {
	const { subscribe, set, update } = writable<number>(1);

	return {
		subscribe,
		set,
		next: (totalPages: number) => {
			update(p => Math.min(p + 1, totalPages));
		},
		prev: () => {
			update(p => Math.max(p - 1, 1));
		},
		goTo: (page: number, totalPages: number) => {
			set(Math.max(1, Math.min(page, totalPages)));
		}
	};
}

// Chapter data store
interface ChapterState {
	chapter: ChapterWithPages | null;
	manga: Manga | null;
	prevChapter: Chapter | null;
	nextChapter: Chapter | null;
	loading: boolean;
	error: string | null;
}

function createChapterStore() {
	const { subscribe, set, update } = writable<ChapterState>({
		chapter: null,
		manga: null,
		prevChapter: null,
		nextChapter: null,
		loading: false,
		error: null
	});

	return {
		subscribe,
		setChapter: (data: {
			chapter: ChapterWithPages;
			manga: Manga;
			navigation: { prev: Chapter | null; next: Chapter | null };
		}) => {
			set({
				chapter: data.chapter,
				manga: data.manga,
				prevChapter: data.navigation.prev,
				nextChapter: data.navigation.next,
				loading: false,
				error: null
			});
		},
		setLoading: (loading: boolean) => {
			update(s => ({ ...s, loading }));
		},
		setError: (error: string) => {
			update(s => ({ ...s, error, loading: false }));
		},
		clear: () => {
			set({
				chapter: null,
				manga: null,
				prevChapter: null,
				nextChapter: null,
				loading: false,
				error: null
			});
		}
	};
}

// Export stores
export const readerSettings = createSettingsStore();
export const currentPage = createCurrentPageStore();
export const chapterState = createChapterStore();

// Derived stores
export const totalPages = derived(chapterState, $state => 
	$state.chapter?.pages.length || 0
);

export const currentPageData = derived(
	[chapterState, currentPage],
	([$state, $page]) => {
		if (!$state.chapter?.pages) return null;
		return $state.chapter.pages.find(p => p.pageNumber === $page) || $state.chapter.pages[$page - 1];
	}
);

export const hasNextPage = derived(
	[currentPage, totalPages],
	([$page, $total]) => $page < $total
);

export const hasPrevPage = derived(
	currentPage,
	$page => $page > 1
);

export const progressPercent = derived(
	[currentPage, totalPages],
	([$page, $total]) => $total > 0 ? Math.round(($page / $total) * 100) : 0
);

// Preload images helper
export function preloadImages(urls: string[]): void {
	urls.forEach(url => {
		const img = new Image();
		img.src = url;
	});
}

// Get images to preload based on current page
export function getPreloadUrls(pages: { imageUrl: string; pageNumber: number }[], currentPageNum: number, count: number = 2): string[] {
	return pages
		.filter(p => p.pageNumber > currentPageNum && p.pageNumber <= currentPageNum + count)
		.map(p => p.imageUrl);
}
