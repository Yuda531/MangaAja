import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getChapterWithPages, getAdjacentChapters, getMangaBySlug } from '$lib/server/db/queries/manga';

export const load: PageServerLoad = async ({ params }) => {
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
		nextChapter: next
	};
};
