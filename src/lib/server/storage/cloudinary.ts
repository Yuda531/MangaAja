import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from '$env/static/private';

// Configure Cloudinary
cloudinary.config({
	cloud_name: CLOUDINARY_CLOUD_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET
});

export interface UploadOptions {
	key: string;
	body: Buffer | Uint8Array | Blob;
	contentType: string;
}

export interface UploadResult {
	url: string;
	key: string;
}

/**
 * Upload a file to Cloudinary
 */
export async function uploadFile(options: UploadOptions): Promise<UploadResult> {
	// Convert body to base64 data URI for Cloudinary upload
	let base64Data: string;
	if (options.body instanceof Blob) {
		const arrayBuffer = await options.body.arrayBuffer();
		base64Data = Buffer.from(arrayBuffer).toString('base64');
	} else {
		base64Data = Buffer.from(options.body).toString('base64');
	}

	const dataUri = `data:${options.contentType};base64,${base64Data}`;

	const result = await cloudinary.uploader.upload(dataUri, {
		public_id: options.key.replace(/\.[^/.]+$/, ''), // Remove file extension for public_id
		folder: '', // Folder is included in the key
		resource_type: 'image',
		overwrite: true
	});

	return {
		url: result.secure_url,
		key: result.public_id
	};
}

/**
 * Delete a file from Cloudinary
 */
export async function deleteFile(key: string): Promise<void> {
	// Remove file extension if present (Cloudinary uses public_id without extension)
	const publicId = key.replace(/\.[^/.]+$/, '');
	await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
}

/**
 * Generate public URL for a file with optional transformations
 */
export function getPublicUrl(key: string): string {
	const publicId = key.replace(/\.[^/.]+$/, '');
	return cloudinary.url(publicId, {
		secure: true
	});
}

/**
 * Generate storage key for manga cover
 */
export function getMangaCoverKey(mangaSlug: string, filename: string): string {
	const ext = filename.split('.').pop() || 'jpg';
	return `covers/${mangaSlug}.${ext}`;
}

/**
 * Generate storage key for chapter page
 */
export function getChapterPageKey(mangaSlug: string, chapterNumber: number, pageNumber: number, filename: string): string {
	const ext = filename.split('.').pop() || 'jpg';
	return `pages/${mangaSlug}/chapter-${chapterNumber}/${pageNumber.toString().padStart(3, '0')}.${ext}`;
}

/**
 * Generate optimized Cloudinary URL with transformations
 */
export function getOptimizedUrl(
	url: string,
	options: { width?: number; height?: number; quality?: number } = {}
): string {
	// If it's already a Cloudinary URL, we can add transformations
	if (!url.includes('cloudinary.com')) {
		return url;
	}

	// Extract public_id from Cloudinary URL
	const urlParts = url.split('/upload/');
	if (urlParts.length !== 2) {
		return url;
	}

	const transformations: string[] = ['f_auto']; // Auto format (WebP for modern browsers)

	if (options.quality) {
		transformations.push(`q_${options.quality}`);
	} else {
		transformations.push('q_auto'); // Auto quality optimization
	}

	if (options.width) {
		transformations.push(`w_${options.width}`);
	}

	if (options.height) {
		transformations.push(`h_${options.height}`);
	}

	// Insert transformations into URL
	return `${urlParts[0]}/upload/${transformations.join(',')}/${urlParts[1]}`;
}
