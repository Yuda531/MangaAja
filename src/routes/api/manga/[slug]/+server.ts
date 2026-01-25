import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getMangaBySlug } from '$lib/server/db/queries/manga';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const manga = await getMangaBySlug(params.slug);

		if (!manga) {
			throw error(404, 'Manga not found');
		}

		return json(manga);
	} catch (err) {
		if (err instanceof Error && 'status' in err) {
			throw err;
		}
		console.error('Error fetching manga:', err);
		return json(
			{ error: 'Internal Server Error', message: 'Failed to fetch manga', statusCode: 500 },
			{ status: 500 }
		);
	}
};
