import type { RequestHandler } from './$types';
import { redirect, json } from '@sveltejs/kit';
import { lucia } from '$lib/server/services/auth';

export const POST: RequestHandler = async ({ locals, cookies, request }) => {
	if (!locals.session) {
		// Check if this is a fetch request (JSON expected)
		const acceptHeader = request.headers.get('accept') || '';
		const contentType = request.headers.get('content-type') || '';
		
		if (acceptHeader.includes('application/json') || contentType.includes('application/json')) {
			return json({ success: true, message: 'Already logged out' });
		}
		throw redirect(302, '/');
	}

	await lucia.invalidateSession(locals.session.id);
	
	const sessionCookie = lucia.createBlankSessionCookie();
	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});

	// Check if this is a fetch request (JSON expected) for SPA-friendly response
	const acceptHeader = request.headers.get('accept') || '';
	const contentType = request.headers.get('content-type') || '';
	
	if (acceptHeader.includes('application/json') || contentType.includes('application/json')) {
		return json({ success: true, message: 'Logged out successfully' });
	}

	// For traditional form submissions, redirect
	throw redirect(302, '/');
};
