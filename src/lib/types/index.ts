// Manga types
export interface Manga {
	id: string;
	title: string;
	slug: string;
	description: string | null;
	coverUrl: string | null;
	status: 'ongoing' | 'completed' | 'hiatus';
	createdAt: Date;
	updatedAt: Date;
}

export interface MangaWithGenres extends Manga {
	genres: Genre[];
}

export interface MangaWithChapters extends MangaWithGenres {
	chapters: Chapter[];
}

export interface Chapter {
	id: string;
	mangaId: string;
	chapterNumber: number;
	title: string | null;
	slug: string;
	createdAt: Date;
}

export interface ChapterWithPages extends Chapter {
	pages: Page[];
}

export interface Page {
	id: string;
	chapterId: string;
	pageNumber: number;
	imageUrl: string;
	width: number | null;
	height: number | null;
}

export interface Genre {
	id: string;
	name: string;
	slug: string;
}

// User types
export interface User {
	id: string;
	email: string;
	username: string;
	avatarUrl: string | null;
	createdAt: Date;
}

export interface Bookmark {
	id: string;
	userId: string;
	mangaId: string;
	createdAt: Date;
}

export interface ReadingProgress {
	id: string;
	userId: string;
	mangaId: string;
	chapterId: string;
	pageNumber: number;
	updatedAt: Date;
}

export interface ReadingHistory {
	id: string;
	userId: string;
	mangaId: string;
	chapterId: string;
	readAt: Date;
}

// API types
export interface PaginatedResponse<T> {
	data: T[];
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

export interface ApiError {
	error: string;
	message: string;
	statusCode: number;
}

// Reader types
export type ReadingMode = 'page' | 'scroll';

export interface ReaderSettings {
	mode: ReadingMode;
	brightness: number;
	fitMode: 'width' | 'height' | 'original';
}

export interface ChapterNavigation {
	current: Chapter;
	prev: Chapter | null;
	next: Chapter | null;
	manga: Manga;
}
