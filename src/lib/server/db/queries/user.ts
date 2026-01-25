import { db } from '../index';
import { users, sessions, bookmarks, readingProgress, readingHistory } from '../schema/user';
import { manga, chapters } from '../schema/manga';
import { eq, and, desc } from 'drizzle-orm';
import type { User, Bookmark, ReadingProgress, ReadingHistory, MangaWithGenres } from '$lib/types';
import { listManga } from './manga';

/**
 * Create a new user
 */
export async function createUser(email: string, username: string, passwordHash: string): Promise<User> {
	const result = await db
		.insert(users)
		.values({ email, username, passwordHash })
		.returning();

	return {
		id: result[0].id,
		email: result[0].email,
		username: result[0].username,
		avatarUrl: result[0].avatarUrl,
		createdAt: result[0].createdAt
	};
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<(User & { passwordHash: string }) | null> {
	const result = await db
		.select()
		.from(users)
		.where(eq(users.email, email))
		.limit(1);

	return result[0] || null;
}

/**
 * Get user by ID
 */
export async function getUserById(id: string): Promise<User | null> {
	const result = await db
		.select({
			id: users.id,
			email: users.email,
			username: users.username,
			avatarUrl: users.avatarUrl,
			createdAt: users.createdAt
		})
		.from(users)
		.where(eq(users.id, id))
		.limit(1);

	return result[0] || null;
}

/**
 * Create session
 */
export async function createSession(id: string, userId: string, expiresAt: Date): Promise<void> {
	await db.insert(sessions).values({ id, userId, expiresAt });
}

/**
 * Get session with user
 */
export async function getSessionWithUser(sessionId: string): Promise<{ session: { id: string; userId: string; expiresAt: Date }; user: User } | null> {
	const result = await db
		.select({
			session: sessions,
			user: {
				id: users.id,
				email: users.email,
				username: users.username,
				avatarUrl: users.avatarUrl,
				createdAt: users.createdAt
			}
		})
		.from(sessions)
		.innerJoin(users, eq(sessions.userId, users.id))
		.where(eq(sessions.id, sessionId))
		.limit(1);

	return result[0] || null;
}

/**
 * Delete session
 */
export async function deleteSession(sessionId: string): Promise<void> {
	await db.delete(sessions).where(eq(sessions.id, sessionId));
}

/**
 * Get user bookmarks
 */
export async function getUserBookmarks(userId: string): Promise<MangaWithGenres[]> {
	const result = await db
		.select({ mangaId: bookmarks.mangaId })
		.from(bookmarks)
		.where(eq(bookmarks.userId, userId))
		.orderBy(desc(bookmarks.createdAt));

	if (result.length === 0) return [];

	// Get manga details for each bookmark
	const mangaList = await listManga({ limit: 100 });
	const bookmarkedIds = new Set(result.map(b => b.mangaId));
	
	return mangaList.data.filter(m => bookmarkedIds.has(m.id));
}

/**
 * Check if manga is bookmarked
 */
export async function isBookmarked(userId: string, mangaId: string): Promise<boolean> {
	const result = await db
		.select()
		.from(bookmarks)
		.where(and(eq(bookmarks.userId, userId), eq(bookmarks.mangaId, mangaId)))
		.limit(1);

	return result.length > 0;
}

/**
 * Add bookmark
 */
export async function addBookmark(userId: string, mangaId: string): Promise<Bookmark> {
	const result = await db
		.insert(bookmarks)
		.values({ userId, mangaId })
		.returning();

	return result[0] as Bookmark;
}

/**
 * Remove bookmark
 */
export async function removeBookmark(userId: string, mangaId: string): Promise<void> {
	await db
		.delete(bookmarks)
		.where(and(eq(bookmarks.userId, userId), eq(bookmarks.mangaId, mangaId)));
}

/**
 * Get or create reading progress
 */
export async function getReadingProgress(userId: string, mangaId: string): Promise<ReadingProgress | null> {
	const result = await db
		.select()
		.from(readingProgress)
		.where(and(eq(readingProgress.userId, userId), eq(readingProgress.mangaId, mangaId)))
		.limit(1);

	return result[0] as ReadingProgress || null;
}

/**
 * Update reading progress
 */
export async function updateReadingProgress(
	userId: string,
	mangaId: string,
	chapterId: string,
	pageNumber: number
): Promise<ReadingProgress> {
	// Check if progress exists
	const existing = await getReadingProgress(userId, mangaId);

	if (existing) {
		const result = await db
			.update(readingProgress)
			.set({ chapterId, pageNumber, updatedAt: new Date() })
			.where(eq(readingProgress.id, existing.id))
			.returning();
		return result[0] as ReadingProgress;
	} else {
		const result = await db
			.insert(readingProgress)
			.values({ userId, mangaId, chapterId, pageNumber })
			.returning();
		return result[0] as ReadingProgress;
	}
}

/**
 * Add to reading history
 */
export async function addToHistory(userId: string, mangaId: string, chapterId: string): Promise<ReadingHistory> {
	const result = await db
		.insert(readingHistory)
		.values({ userId, mangaId, chapterId })
		.returning();

	return result[0] as ReadingHistory;
}

/**
 * Get reading history
 */
export async function getReadingHistory(userId: string, limit: number = 20): Promise<ReadingHistory[]> {
	const result = await db
		.select()
		.from(readingHistory)
		.where(eq(readingHistory.userId, userId))
		.orderBy(desc(readingHistory.readAt))
		.limit(limit);

	return result as ReadingHistory[];
}

/**
 * Clear reading history
 */
export async function clearReadingHistory(userId: string): Promise<void> {
	await db.delete(readingHistory).where(eq(readingHistory.userId, userId));
}
