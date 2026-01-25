import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getReadingHistory } from '$lib/server/db/queries/user';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/auth/login');
	}

	const history = await getReadingHistory(locals.user.id, 50);

	return {
		history,
		user: locals.user
	};
};
