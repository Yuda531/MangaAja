import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { lucia, hashPassword } from '$lib/server/services/auth';
import { createUser, getUserByEmail } from '$lib/server/db/queries/user';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/');
	}
	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString();
		const username = formData.get('username')?.toString();
		const password = formData.get('password')?.toString();
		const confirmPassword = formData.get('confirmPassword')?.toString();

		if (!email || !username || !password) {
			return fail(400, { error: 'All fields are required' });
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return fail(400, { error: 'Invalid email format' });
		}

		// Validate username
		if (username.length < 3 || username.length > 20) {
			return fail(400, { error: 'Username must be 3-20 characters' });
		}

		// Validate password
		if (password.length < 6) {
			return fail(400, { error: 'Password must be at least 6 characters' });
		}

		if (password !== confirmPassword) {
			return fail(400, { error: 'Passwords do not match' });
		}

		// Check if user already exists
		const existingUser = await getUserByEmail(email);
		if (existingUser) {
			return fail(400, { error: 'Email already registered' });
		}

		// Hash password and create user
		const passwordHash = await hashPassword(password);
		
		try {
			const user = await createUser(email, username, passwordHash);

			// Create session
			const session = await lucia.createSession(user.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} catch (err) {
			console.error('Registration error:', err);
			return fail(500, { error: 'Failed to create account' });
		}

		throw redirect(302, '/');
	}
};
