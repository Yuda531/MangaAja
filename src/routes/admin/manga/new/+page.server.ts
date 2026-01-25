import type { PageServerLoad } from './$types';
import { listGenres } from '$lib/server/db/queries/manga';

export const load: PageServerLoad = async () => {
	const genres = await listGenres();
	return { genres };
};
