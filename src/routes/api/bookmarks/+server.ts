import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getUserBookmarks, addBookmark, removeBookmark } from '$lib/server/db/queries/user';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	try {
		const bookmarks = await getUserBookmarks(locals.user.id);
		return json({ data: bookmarks });
	} catch (err) {
		console.error('Error fetching bookmarks:', err);
		return json(
			{ error: 'Internal Server Error', message: 'Failed to fetch bookmarks', statusCode: 500 },
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
		const { mangaId } = body;

		if (!mangaId) {
			throw error(400, 'Manga ID is required');
		}

		const bookmark = await addBookmark(locals.user.id, mangaId);
		return json({ data: bookmark }, { status: 201 });
	} catch (err) {
		if (err instanceof Error && 'status' in err) {
			throw err;
		}
		console.error('Error adding bookmark:', err);
		return json(
			{ error: 'Internal Server Error', message: 'Failed to add bookmark', statusCode: 500 },
			{ status: 500 }
		);
	}
};

export const DELETE: RequestHandler = async ({ url, locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	try {
		const mangaId = url.searchParams.get('mangaId');

		if (!mangaId) {
			throw error(400, 'Manga ID is required');
		}

		await removeBookmark(locals.user.id, mangaId);
		return json({ success: true });
	} catch (err) {
		if (err instanceof Error && 'status' in err) {
			throw err;
		}
		console.error('Error removing bookmark:', err);
		return json(
			{ error: 'Internal Server Error', message: 'Failed to remove bookmark', statusCode: 500 },
			{ status: 500 }
		);
	}
};
