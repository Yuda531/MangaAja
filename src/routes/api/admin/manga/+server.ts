import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createManga } from '$lib/server/db/queries/manga';
import { uploadMangaCover } from '$lib/server/services/image';

export const POST: RequestHandler = async ({ request, locals }) => {
	// Check if user is admin
	if (!locals.user || locals.user.role !== 'admin') {
		throw error(403, 'Forbidden');
	}

	try {
		const formData = await request.formData();
		
		const title = formData.get('title') as string;
		const slug = formData.get('slug') as string;
		const description = formData.get('description') as string;
		const status = formData.get('status') as 'ongoing' | 'completed' | 'hiatus';
		const genreIdsJson = formData.get('genreIds') as string;
		const coverFile = formData.get('cover') as File | null;

		if (!title || !slug) {
			throw error(400, 'Title and slug are required');
		}

		const genreIds = genreIdsJson ? JSON.parse(genreIdsJson) : [];

		// Upload cover if provided
		let coverUrl: string | undefined;
		if (coverFile && coverFile.size > 0) {
			const result = await uploadMangaCover(slug, coverFile);
			coverUrl = result.url;
		}

		// Create manga
		const manga = await createManga({
			title,
			slug,
			description: description || undefined,
			coverUrl,
			status: status || 'ongoing',
			genreIds
		});

		return json({ success: true, slug: manga.slug, id: manga.id });
	} catch (err) {
		console.error('Error creating manga:', err);
		if (err instanceof Error && 'status' in err) {
			throw err;
		}
		throw error(500, 'Failed to create manga');
	}
};
