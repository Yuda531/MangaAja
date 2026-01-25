import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { uploadMangaCover, uploadChapterPage } from '$lib/server/services/image';

export const POST: RequestHandler = async ({ request, locals }) => {
	// Admin check - in production, implement proper admin authentication
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	try {
		const formData = await request.formData();
		const file = formData.get('file') as File | null;
		const type = formData.get('type') as string; // 'cover' or 'page'
		const mangaSlug = formData.get('mangaSlug') as string;

		if (!file || !type || !mangaSlug) {
			throw error(400, 'Missing required fields: file, type, mangaSlug');
		}

		// Validate file type
		if (!file.type.startsWith('image/')) {
			throw error(400, 'File must be an image');
		}

		let result;

		if (type === 'cover') {
			result = await uploadMangaCover(mangaSlug, file);
		} else if (type === 'page') {
			const chapterNumber = parseInt(formData.get('chapterNumber') as string);
			const pageNumber = parseInt(formData.get('pageNumber') as string);

			if (isNaN(chapterNumber) || isNaN(pageNumber)) {
				throw error(400, 'Invalid chapter or page number');
			}

			result = await uploadChapterPage(mangaSlug, chapterNumber, pageNumber, file);
		} else {
			throw error(400, 'Invalid type. Must be "cover" or "page"');
		}

		return json({
			success: true,
			url: result.url,
			key: result.key
		});
	} catch (err) {
		if (err instanceof Error && 'status' in err) {
			throw err;
		}
		console.error('Upload error:', err);
		return json(
			{ error: 'Internal Server Error', message: 'Failed to upload file', statusCode: 500 },
			{ status: 500 }
		);
	}
};
