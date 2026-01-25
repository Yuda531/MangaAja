import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { updateManga, deleteManga, getMangaById } from '$lib/server/db/queries/manga';
import { uploadMangaCover, deleteMangaCover } from '$lib/server/services/image';

export const PUT: RequestHandler = async ({ request, locals, params }) => {
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

		const genreIds = genreIdsJson ? JSON.parse(genreIdsJson) : undefined;

		// Upload new cover if provided
		let coverUrl: string | undefined;
		if (coverFile && coverFile.size > 0) {
			const result = await uploadMangaCover(slug, coverFile);
			coverUrl = result.url;
		}

		// Update manga
		const manga = await updateManga(params.id, {
			title: title || undefined,
			slug: slug || undefined,
			description: description || undefined,
			coverUrl,
			status: status || undefined,
			genreIds
		});

		if (!manga) {
			throw error(404, 'Manga not found');
		}

		return json({ success: true, slug: manga.slug, id: manga.id });
	} catch (err) {
		console.error('Error updating manga:', err);
		if (err instanceof Error && 'status' in err) {
			throw err;
		}
		throw error(500, 'Failed to update manga');
	}
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
	// Check if user is admin
	if (!locals.user || locals.user.role !== 'admin') {
		throw error(403, 'Forbidden');
	}

	try {
		// Get manga to get slug for cover deletion
		const manga = await getMangaById(params.id);
		if (!manga) {
			throw error(404, 'Manga not found');
		}

		// Delete cover from storage
		await deleteMangaCover(manga.slug);

		// Delete manga from database (cascades to chapters and pages)
		const success = await deleteManga(params.id);
		
		if (!success) {
			throw error(404, 'Manga not found');
		}

		return json({ success: true });
	} catch (err) {
		console.error('Error deleting manga:', err);
		if (err instanceof Error && 'status' in err) {
			throw err;
		}
		throw error(500, 'Failed to delete manga');
	}
};
