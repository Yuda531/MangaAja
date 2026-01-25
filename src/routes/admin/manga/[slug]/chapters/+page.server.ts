import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getMangaBySlug, getChaptersForManga } from '$lib/server/db/queries/manga';

export const load: PageServerLoad = async ({ params }) => {
	const manga = await getMangaBySlug(params.slug);
	
	if (!manga) {
		throw error(404, 'Manga not found');
	}

	const chapters = await getChaptersForManga(manga.id);
	
	return { manga, chapters };
};
