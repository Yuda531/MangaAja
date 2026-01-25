import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getReadingHistory, addToHistory, clearReadingHistory } from '$lib/server/db/queries/user';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	try {
		const history = await getReadingHistory(locals.user.id);
		return json({ data: history });
	} catch (err) {
		console.error('Error fetching history:', err);
		return json(
			{ error: 'Internal Server Error', message: 'Failed to fetch history', statusCode: 500 },
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
		const { mangaId, chapterId } = body;

		if (!mangaId || !chapterId) {
			throw error(400, 'mangaId and chapterId are required');
		}

		const entry = await addToHistory(locals.user.id, mangaId, chapterId);
		return json({ data: entry }, { status: 201 });
	} catch (err) {
		if (err instanceof Error && 'status' in err) {
			throw err;
		}
		console.error('Error adding to history:', err);
		return json(
			{ error: 'Internal Server Error', message: 'Failed to add to history', statusCode: 500 },
			{ status: 500 }
		);
	}
};

export const DELETE: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	try {
		await clearReadingHistory(locals.user.id);
		return json({ success: true });
	} catch (err) {
		console.error('Error clearing history:', err);
		return json(
			{ error: 'Internal Server Error', message: 'Failed to clear history', statusCode: 500 },
			{ status: 500 }
		);
	}
};
