import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getAdminStats, ensureDefaultGenres } from '$lib/server/db/queries/manga';

export const load: LayoutServerLoad = async ({ locals }) => {
	// Check if user is logged in
	if (!locals.user) {
		throw redirect(302, '/login?redirect=/admin');
	}

	// Check if user is admin
	if (locals.user.role !== 'admin') {
		throw redirect(302, '/');
	}

	// Ensure default genres exist
	await ensureDefaultGenres();

	// Get admin stats for the dashboard
	const stats = await getAdminStats();

	return {
		user: locals.user,
		stats
	};
};
