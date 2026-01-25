import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { listGenres } from '$lib/server/db/queries/manga';

export const GET: RequestHandler = async () => {
	try {
		const genres = await listGenres();
		return json(genres);
	} catch (error) {
		console.error('Error fetching genres:', error);
		return json(
			{ error: 'Internal Server Error', message: 'Failed to fetch genres', statusCode: 500 },
			{ status: 500 }
		);
	}
};
