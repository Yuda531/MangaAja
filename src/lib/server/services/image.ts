import { uploadFile, getMangaCoverKey, getChapterPageKey, getPublicUrl, deleteFile, getOptimizedUrl } from '../storage/cloudinary';

export interface ImageUploadResult {
	url: string;
	key: string;
}

/**
 * Upload manga cover image
 */
export async function uploadMangaCover(
	mangaSlug: string,
	file: File
): Promise<ImageUploadResult> {
	const buffer = Buffer.from(await file.arrayBuffer());
	const key = getMangaCoverKey(mangaSlug, file.name);

	const result = await uploadFile({
		key,
		body: buffer,
		contentType: file.type
	});

	return result;
}

/**
 * Upload chapter page image
 */
export async function uploadChapterPage(
	mangaSlug: string,
	chapterNumber: number,
	pageNumber: number,
	file: File
): Promise<ImageUploadResult> {
	const buffer = Buffer.from(await file.arrayBuffer());
	const key = getChapterPageKey(mangaSlug, chapterNumber, pageNumber, file.name);

	const result = await uploadFile({
		key,
		body: buffer,
		contentType: file.type
	});

	return result;
}

/**
 * Delete manga cover
 */
export async function deleteMangaCover(mangaSlug: string): Promise<void> {
	// Try common extensions
	const extensions = ['jpg', 'jpeg', 'png', 'webp'];
	for (const ext of extensions) {
		try {
			await deleteFile(`covers/${mangaSlug}.${ext}`);
		} catch {
			// Ignore if file doesn't exist
		}
	}
}

/**
 * Get optimized image URL with Cloudinary transformations
 * - Auto format (WebP for modern browsers)
 * - Quality optimization
 * - Optional resize
 */
export function getOptimizedImageUrl(
	url: string,
	options: { width?: number; height?: number; quality?: number } = {}
): string {
	return getOptimizedUrl(url, options);
}

/**
 * Generate placeholder data URL for loading state
 */
export function getPlaceholderDataUrl(width: number = 300, height: number = 400): string {
	return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Crect fill='%231a1a1a' width='${width}' height='${height}'/%3E%3C/svg%3E`;
}
