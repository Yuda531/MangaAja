import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { searchManga } from '$lib/server/db/queries/manga';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const query = url.searchParams.get('q');

		if (!query || query.length < 2) {
			return json({ data: [] });
		}

		const results = await searchManga(query, 10);
		return json({ data: results });
	} catch (error) {
		console.error('Error searching manga:', error);
		return json(
			{ error: 'Internal Server Error', message: 'Search failed', statusCode: 500 },
			{ status: 500 }
		);
	}
};
