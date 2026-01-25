import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { updateReadingProgress, getReadingProgress } from '$lib/server/db/queries/user';

export const GET: RequestHandler = async ({ url, locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	try {
		const mangaId = url.searchParams.get('mangaId');

		if (!mangaId) {
			throw error(400, 'Manga ID is required');
		}

		const progress = await getReadingProgress(locals.user.id, mangaId);
		return json({ data: progress });
	} catch (err) {
		if (err instanceof Error && 'status' in err) {
			throw err;
		}
		console.error('Error fetching progress:', err);
		return json(
			{ error: 'Internal Server Error', message: 'Failed to fetch progress', statusCode: 500 },
			{ status: 500 }
		);
	}
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	try {
		const body = await request.json();
		const { mangaId, chapterId, pageNumber } = body;

		if (!mangaId || !chapterId || pageNumber === undefined) {
			throw error(400, 'mangaId, chapterId, and pageNumber are required');
		}

		const progress = await updateReadingProgress(locals.user.id, mangaId, chapterId, pageNumber);
		return json({ data: progress });
	} catch (err) {
		if (err instanceof Error && 'status' in err) {
			throw err;
		}
		console.error('Error updating progress:', err);
		return json(
			{ error: 'Internal Server Error', message: 'Failed to update progress', statusCode: 500 },
			{ status: 500 }
		);
	}
};
