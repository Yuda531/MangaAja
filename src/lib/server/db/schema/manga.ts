import { pgTable, text, timestamp, integer, primaryKey, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '../../../utils/id';

// Enums
export const mangaStatusEnum = pgEnum('manga_status', ['ongoing', 'completed', 'hiatus']);

// Tables
export const manga = pgTable('manga', {
	id: text('id').primaryKey().$defaultFn(() => createId()),
	title: text('title').notNull(),
	slug: text('slug').notNull().unique(),
	description: text('description'),
	coverUrl: text('cover_url'),
	status: mangaStatusEnum('status').notNull().default('ongoing'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const chapters = pgTable('chapters', {
	id: text('id').primaryKey().$defaultFn(() => createId()),
	mangaId: text('manga_id').notNull().references(() => manga.id, { onDelete: 'cascade' }),
	chapterNumber: integer('chapter_number').notNull(),
	title: text('title'),
	slug: text('slug').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

export const pages = pgTable('pages', {
	id: text('id').primaryKey().$defaultFn(() => createId()),
	chapterId: text('chapter_id').notNull().references(() => chapters.id, { onDelete: 'cascade' }),
	pageNumber: integer('page_number').notNull(),
	imageUrl: text('image_url').notNull(),
	width: integer('width'),
	height: integer('height')
});

export const genres = pgTable('genres', {
	id: text('id').primaryKey().$defaultFn(() => createId()),
	name: text('name').notNull().unique(),
	slug: text('slug').notNull().unique()
});

export const mangaGenres = pgTable('manga_genres', {
	mangaId: text('manga_id').notNull().references(() => manga.id, { onDelete: 'cascade' }),
	genreId: text('genre_id').notNull().references(() => genres.id, { onDelete: 'cascade' })
}, (table) => ({
	pk: primaryKey({ columns: [table.mangaId, table.genreId] })
}));

// Relations
export const mangaRelations = relations(manga, ({ many }) => ({
	chapters: many(chapters),
	mangaGenres: many(mangaGenres)
}));

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
	manga: one(manga, {
		fields: [chapters.mangaId],
		references: [manga.id]
	}),
	pages: many(pages)
}));

export const pagesRelations = relations(pages, ({ one }) => ({
	chapter: one(chapters, {
		fields: [pages.chapterId],
		references: [chapters.id]
	})
}));

export const genresRelations = relations(genres, ({ many }) => ({
	mangaGenres: many(mangaGenres)
}));

export const mangaGenresRelations = relations(mangaGenres, ({ one }) => ({
	manga: one(manga, {
		fields: [mangaGenres.mangaId],
		references: [manga.id]
	}),
	genre: one(genres, {
		fields: [mangaGenres.genreId],
		references: [genres.id]
	})
}));
