import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { listManga, type ListMangaParams } from '$lib/server/db/queries/manga';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const params: ListMangaParams = {
			page: parseInt(url.searchParams.get('page') || '1'),
			limit: parseInt(url.searchParams.get('limit') || '20'),
			genre: url.searchParams.get('genre') || undefined,
			status: url.searchParams.get('status') as ListMangaParams['status'] || undefined,
			search: url.searchParams.get('search') || undefined,
			sort: url.searchParams.get('sort') as ListMangaParams['sort'] || 'latest'
		};

		const result = await listManga(params);
		return json(result);
	} catch (error) {
		console.error('Error fetching manga list:', error);
		return json(
			{ error: 'Internal Server Error', message: 'Failed to fetch manga list', statusCode: 500 },
			{ status: 500 }
		);
	}
};
