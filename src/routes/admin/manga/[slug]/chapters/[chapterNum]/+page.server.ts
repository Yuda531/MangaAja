import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getMangaBySlug, getChapterWithPages } from '$lib/server/db/queries/manga';

export const load: PageServerLoad = async ({ params }) => {
	const manga = await getMangaBySlug(params.slug);
	
	if (!manga) {
		throw error(404, 'Manga not found');
	}

	const chapter = await getChapterWithPages(params.slug, parseInt(params.chapterNum));
	
	if (!chapter) {
		throw error(404, 'Chapter not found');
	}
	
	return { manga, chapter };
};
