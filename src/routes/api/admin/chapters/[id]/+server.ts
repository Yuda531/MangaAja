import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { updateChapter, deleteChapter } from '$lib/server/db/queries/manga';

export const PUT: RequestHandler = async ({ request, locals, params }) => {
	// Check if user is admin
	if (!locals.user || locals.user.role !== 'admin') {
		throw error(403, 'Forbidden');
	}

	try {
		const data = await request.json();
		
		const chapter = await updateChapter(params.id, {
			chapterNumber: data.chapterNumber,
			title: data.title,
			slug: data.slug
		});

		if (!chapter) {
			throw error(404, 'Chapter not found');
		}

		return json({ success: true, chapterId: chapter.id });
	} catch (err) {
		console.error('Error updating chapter:', err);
		if (err instanceof Error && 'status' in err) {
			throw err;
		}
		throw error(500, 'Failed to update chapter');
	}
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
	// Check if user is admin
	if (!locals.user || locals.user.role !== 'admin') {
		throw error(403, 'Forbidden');
	}

	try {
		const success = await deleteChapter(params.id);
		
		if (!success) {
			throw error(404, 'Chapter not found');
		}

		return json({ success: true });
	} catch (err) {
		console.error('Error deleting chapter:', err);
		if (err instanceof Error && 'status' in err) {
			throw err;
		}
		throw error(500, 'Failed to delete chapter');
	}
};
