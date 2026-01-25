import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getChapterWithPages, getAdjacentChapters, getMangaBySlug } from '$lib/server/db/queries/manga';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const chapterNumber = parseInt(params.chapterNum);

		if (isNaN(chapterNumber)) {
			throw error(400, 'Invalid chapter number');
		}

		const chapter = await getChapterWithPages(params.slug, chapterNumber);

		if (!chapter) {
			throw error(404, 'Chapter not found');
		}

		// Get manga info for navigation
		const manga = await getMangaBySlug(params.slug);
		if (!manga) {
			throw error(404, 'Manga not found');
		}

		// Get adjacent chapters
		const { prev, next } = await getAdjacentChapters(manga.id, chapterNumber);

		return json({
			chapter,
			manga: {
				id: manga.id,
				title: manga.title,
				slug: manga.slug
			},
			navigation: {
				prev,
				next
			}
		});
	} catch (err) {
		if (err instanceof Error && 'status' in err) {
			throw err;
		}
		console.error('Error fetching chapter:', err);
		return json(
			{ error: 'Internal Server Error', message: 'Failed to fetch chapter', statusCode: 500 },
			{ status: 500 }
		);
	}
};
