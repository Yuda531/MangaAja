import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getUserBookmarks } from '$lib/server/db/queries/user';
import { listManga } from '$lib/server/db/queries/manga';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/auth/login');
	}

	const bookmarks = await getUserBookmarks(locals.user.id);

	// Get manga with reading progress for "Continue Reading"
	// For now, just return bookmarks
	return {
		bookmarks,
		user: locals.user
	};
};
