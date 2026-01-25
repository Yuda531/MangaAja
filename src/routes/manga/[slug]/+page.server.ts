import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getMangaBySlug } from '$lib/server/db/queries/manga';
import { isBookmarked, getReadingProgress } from '$lib/server/db/queries/user';

export const load: PageServerLoad = async ({ params, locals }) => {
	const manga = await getMangaBySlug(params.slug);

	if (!manga) {
		throw error(404, 'Manga not found');
	}

	let bookmarked = false;
	let progress = null;

	if (locals.user) {
		[bookmarked, progress] = await Promise.all([
			isBookmarked(locals.user.id, manga.id),
			getReadingProgress(locals.user.id, manga.id)
		]);
	}

	return {
		manga,
		bookmarked,
		progress
	};
};
