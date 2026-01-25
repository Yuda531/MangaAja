import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getMangaBySlug, getChaptersForManga } from '$lib/server/db/queries/manga';

export const load: PageServerLoad = async ({ params }) => {
	const manga = await getMangaBySlug(params.slug);
	
	if (!manga) {
		throw error(404, 'Manga not found');
	}

	const chapters = await getChaptersForManga(manga.id);
	const nextChapterNumber = chapters.length > 0 
		? Math.max(...chapters.map(c => c.chapterNumber)) + 1 
		: 1;
	
	return { manga, nextChapterNumber };
};
