import type { PageServerLoad } from './$types';
import { getFeaturedManga, listManga, listGenres } from '$lib/server/db/queries/manga';

export const load: PageServerLoad = async () => {
	const [featured, latest, genres] = await Promise.all([
		getFeaturedManga(5),
		listManga({ limit: 12, sort: 'latest' }),
		listGenres()
	]);

	return {
		featured,
		latest: latest.data,
		genres
	};
};
