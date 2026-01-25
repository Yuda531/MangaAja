// Simple ID generator using crypto
export function createId(): string {
	const timestamp = Date.now().toString(36);
	const randomPart = Math.random().toString(36).substring(2, 10);
	return `${timestamp}${randomPart}`;
}

export function createSlug(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '');
}
