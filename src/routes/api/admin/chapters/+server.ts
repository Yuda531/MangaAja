import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createChapter, createPages } from '$lib/server/db/queries/manga';
import { uploadChapterPage } from '$lib/server/services/image';

export const POST: RequestHandler = async ({ request, locals }) => {
	// Check if user is admin
	if (!locals.user || locals.user.role !== 'admin') {
		throw error(403, 'Forbidden');
	}

	try {
		const formData = await request.formData();
		
		const mangaId = formData.get('mangaId') as string;
		const mangaSlug = formData.get('mangaSlug') as string;
		const chapterNumber = parseInt(formData.get('chapterNumber') as string);
		const title = formData.get('title') as string;
		const slug = formData.get('slug') as string;
		const pageFiles = formData.getAll('pages') as File[];

		if (!mangaId || !chapterNumber || !slug) {
			throw error(400, 'Missing required fields');
		}

		// Create chapter
		const chapter = await createChapter({
			mangaId,
			chapterNumber,
			title: title || undefined,
			slug
		});

		// Upload pages and create page records
		if (pageFiles.length > 0) {
			const pagesData = [];
			for (let i = 0; i < pageFiles.length; i++) {
				const file = pageFiles[i];
				if (file.size > 0) {
					const result = await uploadChapterPage(mangaSlug, chapterNumber, i + 1, file);
					pagesData.push({
						chapterId: chapter.id,
						pageNumber: i + 1,
						imageUrl: result.url
					});
				}
			}

			if (pagesData.length > 0) {
				await createPages(pagesData);
			}
		}

		return json({ success: true, chapterId: chapter.id });
	} catch (err) {
		console.error('Error creating chapter:', err);
		if (err instanceof Error && 'status' in err) {
			throw err;
		}
		throw error(500, 'Failed to create chapter');
	}
};
