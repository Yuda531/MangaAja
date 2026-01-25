import type { PageServerLoad } from './$types';
import { getAllMangaForAdmin } from '$lib/server/db/queries/manga';

export const load: PageServerLoad = async () => {
	const manga = await getAllMangaForAdmin();
	return { manga };
};
