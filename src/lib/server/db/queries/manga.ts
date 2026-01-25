import { db } from '../index';
import { manga, chapters, pages, genres, mangaGenres } from '../schema/manga';
import { users } from '../schema/user';
import { eq, desc, asc, ilike, and, sql, count } from 'drizzle-orm';
import type { Manga, MangaWithGenres, MangaWithChapters, Chapter, ChapterWithPages, Genre, PaginatedResponse } from '$lib/types';

export interface ListMangaParams {
	page?: number;
	limit?: number;
	genre?: string;
	status?: 'ongoing' | 'completed' | 'hiatus';
	search?: string;
	sort?: 'latest' | 'popular' | 'title';
}

/**
 * Get paginated list of manga
 */
export async function listManga(params: ListMangaParams = {}): Promise<PaginatedResponse<MangaWithGenres>> {
	const { page = 1, limit = 20, genre, status, search, sort = 'latest' } = params;
	const offset = (page - 1) * limit;

	// Build conditions
	const conditions = [];
	if (status) {
		conditions.push(eq(manga.status, status));
	}
	if (search) {
		conditions.push(ilike(manga.title, `%${search}%`));
	}

	// Build order
	let orderBy;
	switch (sort) {
		case 'title':
			orderBy = asc(manga.title);
			break;
		case 'latest':
		default:
			orderBy = desc(manga.updatedAt);
			break;
	}

	// Execute query
	let query = db
		.select()
		.from(manga)
		.orderBy(orderBy)
		.limit(limit)
		.offset(offset);

	if (conditions.length > 0) {
		query = query.where(and(...conditions)) as typeof query;
	}

	const results = await query;

	// Get genres for each manga
	const mangaWithGenres: MangaWithGenres[] = await Promise.all(
		results.map(async (m) => {
			const genreResults = await db
				.select({ genre: genres })
				.from(mangaGenres)
				.innerJoin(genres, eq(mangaGenres.genreId, genres.id))
				.where(eq(mangaGenres.mangaId, m.id));

			return {
				...m,
				genres: genreResults.map(r => r.genre)
			} as MangaWithGenres;
		})
	);

	// Filter by genre if specified
	let filteredManga = mangaWithGenres;
	if (genre) {
		filteredManga = mangaWithGenres.filter(m => 
			m.genres.some(g => g.slug === genre)
		);
	}

	// Get total count
	const countResult = await db
		.select({ count: sql<number>`count(*)` })
		.from(manga);
	const total = Number(countResult[0]?.count || 0);

	return {
		data: filteredManga,
		page,
		limit,
		total,
		totalPages: Math.ceil(total / limit)
	};
}

/**
 * Get manga by slug with all details
 */
export async function getMangaBySlug(slug: string): Promise<MangaWithChapters | null> {
	const result = await db
		.select()
		.from(manga)
		.where(eq(manga.slug, slug))
		.limit(1);

	if (result.length === 0) return null;

	const m = result[0];

	// Get genres
	const genreResults = await db
		.select({ genre: genres })
		.from(mangaGenres)
		.innerJoin(genres, eq(mangaGenres.genreId, genres.id))
		.where(eq(mangaGenres.mangaId, m.id));

	// Get chapters
	const chapterResults = await db
		.select()
		.from(chapters)
		.where(eq(chapters.mangaId, m.id))
		.orderBy(desc(chapters.chapterNumber));

	return {
		...m,
		genres: genreResults.map(r => r.genre),
		chapters: chapterResults
	} as MangaWithChapters;
}

/**
 * Get chapter with pages
 */
export async function getChapterWithPages(mangaSlug: string, chapterNumber: number): Promise<ChapterWithPages | null> {
	// First get the manga
	const mangaResult = await db
		.select()
		.from(manga)
		.where(eq(manga.slug, mangaSlug))
		.limit(1);

	if (mangaResult.length === 0) return null;

	// Get the chapter
	const chapterResult = await db
		.select()
		.from(chapters)
		.where(and(
			eq(chapters.mangaId, mangaResult[0].id),
			eq(chapters.chapterNumber, chapterNumber)
		))
		.limit(1);

	if (chapterResult.length === 0) return null;

	const chapter = chapterResult[0];

	// Get pages
	const pageResults = await db
		.select()
		.from(pages)
		.where(eq(pages.chapterId, chapter.id))
		.orderBy(asc(pages.pageNumber));

	return {
		...chapter,
		pages: pageResults
	} as ChapterWithPages;
}

/**
 * Get adjacent chapters for navigation
 */
export async function getAdjacentChapters(mangaId: string, chapterNumber: number): Promise<{ prev: Chapter | null; next: Chapter | null }> {
	const prevResult = await db
		.select()
		.from(chapters)
		.where(and(
			eq(chapters.mangaId, mangaId),
			sql`${chapters.chapterNumber} < ${chapterNumber}`
		))
		.orderBy(desc(chapters.chapterNumber))
		.limit(1);

	const nextResult = await db
		.select()
		.from(chapters)
		.where(and(
			eq(chapters.mangaId, mangaId),
			sql`${chapters.chapterNumber} > ${chapterNumber}`
		))
		.orderBy(asc(chapters.chapterNumber))
		.limit(1);

	return {
		prev: prevResult[0] as Chapter || null,
		next: nextResult[0] as Chapter || null
	};
}

/**
 * Get all genres
 */
export async function listGenres(): Promise<Genre[]> {
	const results = await db
		.select()
		.from(genres)
		.orderBy(asc(genres.name));

	return results as Genre[];
}

/**
 * Get featured manga (latest with covers)
 */
export async function getFeaturedManga(limit: number = 5): Promise<MangaWithGenres[]> {
	const results = await db
		.select()
		.from(manga)
		.where(sql`${manga.coverUrl} IS NOT NULL`)
		.orderBy(desc(manga.updatedAt))
		.limit(limit);

	const mangaWithGenres: MangaWithGenres[] = await Promise.all(
		results.map(async (m) => {
			const genreResults = await db
				.select({ genre: genres })
				.from(mangaGenres)
				.innerJoin(genres, eq(mangaGenres.genreId, genres.id))
				.where(eq(mangaGenres.mangaId, m.id));

			return {
				...m,
				genres: genreResults.map(r => r.genre)
			} as MangaWithGenres;
		})
	);

	return mangaWithGenres;
}

/**
 * Search manga by title
 */
export async function searchManga(query: string, limit: number = 10): Promise<Manga[]> {
	const results = await db
		.select()
		.from(manga)
		.where(ilike(manga.title, `%${query}%`))
		.orderBy(desc(manga.updatedAt))
		.limit(limit);

	return results as Manga[];
}

// ==================== Admin CRUD Functions ====================

/**
 * Default genres to seed if none exist
 */
export const DEFAULT_GENRES = [
	{ name: 'Action', slug: 'action' },
	{ name: 'Adventure', slug: 'adventure' },
	{ name: 'Comedy', slug: 'comedy' },
	{ name: 'Drama', slug: 'drama' },
	{ name: 'Fantasy', slug: 'fantasy' },
	{ name: 'Horror', slug: 'horror' },
	{ name: 'Isekai', slug: 'isekai' },
	{ name: 'Mecha', slug: 'mecha' },
	{ name: 'Mystery', slug: 'mystery' },
	{ name: 'Psychological', slug: 'psychological' },
	{ name: 'Romance', slug: 'romance' },
	{ name: 'Sci-Fi', slug: 'sci-fi' },
	{ name: 'Slice of Life', slug: 'slice-of-life' },
	{ name: 'Sports', slug: 'sports' },
	{ name: 'Supernatural', slug: 'supernatural' },
	{ name: 'Thriller', slug: 'thriller' }
];

/**
 * Ensure default genres exist in database
 */
export async function ensureDefaultGenres(): Promise<void> {
	for (const genre of DEFAULT_GENRES) {
		const existing = await db
			.select()
			.from(genres)
			.where(eq(genres.slug, genre.slug))
			.limit(1);
		
		if (existing.length === 0) {
			await db.insert(genres).values(genre);
		}
	}
}

/**
 * Get admin dashboard stats
 */
export async function getAdminStats(): Promise<{
	totalManga: number;
	totalChapters: number;
	totalUsers: number;
}> {
	const [mangaCount] = await db.select({ count: count() }).from(manga);
	const [chapterCount] = await db.select({ count: count() }).from(chapters);
	const [userCount] = await db.select({ count: count() }).from(users);

	return {
		totalManga: mangaCount?.count || 0,
		totalChapters: chapterCount?.count || 0,
		totalUsers: userCount?.count || 0
	};
}

/**
 * Get all manga for admin (no pagination)
 */
export async function getAllMangaForAdmin(): Promise<MangaWithGenres[]> {
	const results = await db
		.select()
		.from(manga)
		.orderBy(desc(manga.updatedAt));

	const mangaWithGenres: MangaWithGenres[] = await Promise.all(
		results.map(async (m) => {
			const genreResults = await db
				.select({ genre: genres })
				.from(mangaGenres)
				.innerJoin(genres, eq(mangaGenres.genreId, genres.id))
				.where(eq(mangaGenres.mangaId, m.id));

			return {
				...m,
				genres: genreResults.map(r => r.genre)
			} as MangaWithGenres;
		})
	);

	return mangaWithGenres;
}

/**
 * Get manga by ID
 */
export async function getMangaById(id: string): Promise<MangaWithGenres | null> {
	const result = await db
		.select()
		.from(manga)
		.where(eq(manga.id, id))
		.limit(1);

	if (result.length === 0) return null;

	const m = result[0];
	const genreResults = await db
		.select({ genre: genres })
		.from(mangaGenres)
		.innerJoin(genres, eq(mangaGenres.genreId, genres.id))
		.where(eq(mangaGenres.mangaId, m.id));

	return {
		...m,
		genres: genreResults.map(r => r.genre)
	} as MangaWithGenres;
}

/**
 * Create new manga
 */
export async function createManga(data: {
	title: string;
	slug: string;
	description?: string;
	coverUrl?: string;
	status?: 'ongoing' | 'completed' | 'hiatus';
	genreIds?: string[];
}): Promise<Manga> {
	const [newManga] = await db.insert(manga).values({
		title: data.title,
		slug: data.slug,
		description: data.description || null,
		coverUrl: data.coverUrl || null,
		status: data.status || 'ongoing'
	}).returning();

	// Add genres
	if (data.genreIds && data.genreIds.length > 0) {
		await db.insert(mangaGenres).values(
			data.genreIds.map(genreId => ({
				mangaId: newManga.id,
				genreId
			}))
		);
	}

	return newManga as Manga;
}

/**
 * Update manga
 */
export async function updateManga(id: string, data: {
	title?: string;
	slug?: string;
	description?: string;
	coverUrl?: string;
	status?: 'ongoing' | 'completed' | 'hiatus';
	genreIds?: string[];
}): Promise<Manga | null> {
	const updateData: Record<string, unknown> = { updatedAt: new Date() };
	if (data.title !== undefined) updateData.title = data.title;
	if (data.slug !== undefined) updateData.slug = data.slug;
	if (data.description !== undefined) updateData.description = data.description;
	if (data.coverUrl !== undefined) updateData.coverUrl = data.coverUrl;
	if (data.status !== undefined) updateData.status = data.status;

	const [updated] = await db
		.update(manga)
		.set(updateData)
		.where(eq(manga.id, id))
		.returning();

	if (!updated) return null;

	// Update genres if provided
	if (data.genreIds !== undefined) {
		// Delete existing genre associations
		await db.delete(mangaGenres).where(eq(mangaGenres.mangaId, id));
		
		// Add new genres
		if (data.genreIds.length > 0) {
			await db.insert(mangaGenres).values(
				data.genreIds.map(genreId => ({
					mangaId: id,
					genreId
				}))
			);
		}
	}

	return updated as Manga;
}

/**
 * Delete manga
 */
export async function deleteManga(id: string): Promise<boolean> {
	const result = await db.delete(manga).where(eq(manga.id, id)).returning();
	return result.length > 0;
}

/**
 * Create chapter
 */
export async function createChapter(data: {
	mangaId: string;
	chapterNumber: number;
	title?: string;
	slug: string;
}): Promise<Chapter> {
	const [newChapter] = await db.insert(chapters).values({
		mangaId: data.mangaId,
		chapterNumber: data.chapterNumber,
		title: data.title || null,
		slug: data.slug
	}).returning();

	// Update manga's updatedAt
	await db.update(manga)
		.set({ updatedAt: new Date() })
		.where(eq(manga.id, data.mangaId));

	return newChapter as Chapter;
}

/**
 * Get chapter by ID
 */
export async function getChapterById(id: string): Promise<ChapterWithPages | null> {
	const result = await db
		.select()
		.from(chapters)
		.where(eq(chapters.id, id))
		.limit(1);

	if (result.length === 0) return null;

	const chapter = result[0];
	const pageResults = await db
		.select()
		.from(pages)
		.where(eq(pages.chapterId, chapter.id))
		.orderBy(asc(pages.pageNumber));

	return {
		...chapter,
		pages: pageResults
	} as ChapterWithPages;
}

/**
 * Update chapter
 */
export async function updateChapter(id: string, data: {
	chapterNumber?: number;
	title?: string;
	slug?: string;
}): Promise<Chapter | null> {
	const updateData: Record<string, unknown> = {};
	if (data.chapterNumber !== undefined) updateData.chapterNumber = data.chapterNumber;
	if (data.title !== undefined) updateData.title = data.title;
	if (data.slug !== undefined) updateData.slug = data.slug;

	const [updated] = await db
		.update(chapters)
		.set(updateData)
		.where(eq(chapters.id, id))
		.returning();

	return updated as Chapter || null;
}

/**
 * Delete chapter
 */
export async function deleteChapter(id: string): Promise<boolean> {
	const result = await db.delete(chapters).where(eq(chapters.id, id)).returning();
	return result.length > 0;
}

/**
 * Create page
 */
export async function createPage(data: {
	chapterId: string;
	pageNumber: number;
	imageUrl: string;
	width?: number;
	height?: number;
}): Promise<{ id: string; chapterId: string; pageNumber: number; imageUrl: string; width: number | null; height: number | null }> {
	const [newPage] = await db.insert(pages).values({
		chapterId: data.chapterId,
		pageNumber: data.pageNumber,
		imageUrl: data.imageUrl,
		width: data.width || null,
		height: data.height || null
	}).returning();

	return newPage;
}

/**
 * Create multiple pages at once
 */
export async function createPages(pagesData: Array<{
	chapterId: string;
	pageNumber: number;
	imageUrl: string;
	width?: number;
	height?: number;
}>): Promise<void> {
	if (pagesData.length === 0) return;

	await db.insert(pages).values(
		pagesData.map(p => ({
			chapterId: p.chapterId,
			pageNumber: p.pageNumber,
			imageUrl: p.imageUrl,
			width: p.width || null,
			height: p.height || null
		}))
	);
}

/**
 * Delete page
 */
export async function deletePage(id: string): Promise<boolean> {
	const result = await db.delete(pages).where(eq(pages.id, id)).returning();
	return result.length > 0;
}

/**
 * Get chapters for a manga
 */
export async function getChaptersForManga(mangaId: string): Promise<Chapter[]> {
	const results = await db
		.select()
		.from(chapters)
		.where(eq(chapters.mangaId, mangaId))
		.orderBy(desc(chapters.chapterNumber));

	return results as Chapter[];
}
