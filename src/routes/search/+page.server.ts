import type { PageServerLoad } from './$types';
import { searchManga } from '$lib/server/db/queries/manga';

export const load: PageServerLoad = async ({ url }) => {
	const query = url.searchParams.get('q') || '';

	if (query.length < 2) {
		return {
			query,
			results: []
		};
	}

	const results = await searchManga(query, 50);

	return {
		query,
		results
	};
};
