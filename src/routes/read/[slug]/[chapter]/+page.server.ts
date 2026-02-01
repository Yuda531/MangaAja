import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getChapterWithPages, getAdjacentChapters, getMangaBySlug } from '$lib/server/db/queries/manga';
import { addToHistory, updateReadingProgress, getReadingProgress } from '$lib/server/db/queries/user';

export const load: PageServerLoad = async ({ params, locals }) => {
	const chapterNumber = parseInt(params.chapter);

	if (isNaN(chapterNumber)) {
		throw error(400, 'Invalid chapter number');
	}

	// Get manga first
	const manga = await getMangaBySlug(params.slug);
	if (!manga) {
		throw error(404, 'Manga not found');
	}

	// Get chapter with pages
	const chapter = await getChapterWithPages(params.slug, chapterNumber);
	if (!chapter) {
		throw error(404, 'Chapter not found');
	}

	// Get adjacent chapters for navigation
	const { prev, next } = await getAdjacentChapters(manga.id, chapterNumber);

	// If user is logged in, track reading history and get progress
	let currentProgress = null;
	if (locals.user) {
		// Add to reading history (or update if exists)
		await addToHistory(locals.user.id, manga.id, chapter.id);
		
		// Get current reading progress for this manga
		currentProgress = await getReadingProgress(locals.user.id, manga.id);
	}

	return {
		chapter,
		manga: {
			id: manga.id,
			title: manga.title,
			slug: manga.slug,
			description: manga.description,
			coverUrl: manga.coverUrl,
			status: manga.status,
			createdAt: manga.createdAt,
			updatedAt: manga.updatedAt
		},
		prevChapter: prev,
		nextChapter: next,
		currentProgress,
		isLoggedIn: !!locals.user
	};
};
