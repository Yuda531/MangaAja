import { pgTable, text, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '../../../utils/id';
import { manga, chapters } from './manga';

// Enums
export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);

// Tables
export const users = pgTable('users', {
	id: text('id').primaryKey().$defaultFn(() => createId()),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	username: text('username').notNull().unique(),
	avatarUrl: text('avatar_url'),
	role: userRoleEnum('role').notNull().default('user'),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at').notNull()
});

export const bookmarks = pgTable('bookmarks', {
	id: text('id').primaryKey().$defaultFn(() => createId()),
	userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	mangaId: text('manga_id').notNull().references(() => manga.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

export const readingProgress = pgTable('reading_progress', {
	id: text('id').primaryKey().$defaultFn(() => createId()),
	userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	mangaId: text('manga_id').notNull().references(() => manga.id, { onDelete: 'cascade' }),
	chapterId: text('chapter_id').notNull().references(() => chapters.id, { onDelete: 'cascade' }),
	pageNumber: integer('page_number').notNull().default(1),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const readingHistory = pgTable('reading_history', {
	id: text('id').primaryKey().$defaultFn(() => createId()),
	userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	mangaId: text('manga_id').notNull().references(() => manga.id, { onDelete: 'cascade' }),
	chapterId: text('chapter_id').notNull().references(() => chapters.id, { onDelete: 'cascade' }),
	readAt: timestamp('read_at').defaultNow().notNull()
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
	bookmarks: many(bookmarks),
	readingProgress: many(readingProgress),
	readingHistory: many(readingHistory)
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	})
}));

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
	user: one(users, {
		fields: [bookmarks.userId],
		references: [users.id]
	}),
	manga: one(manga, {
		fields: [bookmarks.mangaId],
		references: [manga.id]
	})
}));

export const readingProgressRelations = relations(readingProgress, ({ one }) => ({
	user: one(users, {
		fields: [readingProgress.userId],
		references: [users.id]
	}),
	manga: one(manga, {
		fields: [readingProgress.mangaId],
		references: [manga.id]
	}),
	chapter: one(chapters, {
		fields: [readingProgress.chapterId],
		references: [chapters.id]
	})
}));

export const readingHistoryRelations = relations(readingHistory, ({ one }) => ({
	user: one(users, {
		fields: [readingHistory.userId],
		references: [users.id]
	}),
	manga: one(manga, {
		fields: [readingHistory.mangaId],
		references: [manga.id]
	}),
	chapter: one(chapters, {
		fields: [readingHistory.chapterId],
		references: [chapters.id]
	})
}));
