import type { PageServerLoad } from './$types';
import { listManga, listGenres, type ListMangaParams } from '$lib/server/db/queries/manga';

export const load: PageServerLoad = async ({ url }) => {
	const params: ListMangaParams = {
		page: parseInt(url.searchParams.get('page') || '1'),
		limit: 20,
		genre: url.searchParams.get('genre') || undefined,
		status: url.searchParams.get('status') as ListMangaParams['status'] || undefined,
		search: url.searchParams.get('search') || undefined,
		sort: url.searchParams.get('sort') as ListMangaParams['sort'] || 'latest'
	};

	const [mangaResult, genres] = await Promise.all([
		listManga(params),
		listGenres()
	]);

	return {
		manga: mangaResult.data,
		pagination: {
			page: mangaResult.page,
			limit: mangaResult.limit,
			total: mangaResult.total,
			totalPages: mangaResult.totalPages
		},
		genres,
		filters: {
			genre: params.genre,
			status: params.status,
			sort: params.sort
		}
	};
};
