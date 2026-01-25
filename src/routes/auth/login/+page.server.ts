import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { lucia, verifyPassword } from '$lib/server/services/auth';
import { getUserByEmail } from '$lib/server/db/queries/user';

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
		const password = formData.get('password')?.toString();

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required' });
		}

		// Get user
		const user = await getUserByEmail(email);
		if (!user) {
			return fail(400, { error: 'Invalid email or password' });
		}

		// Verify password
		const validPassword = await verifyPassword(password, user.passwordHash);
		if (!validPassword) {
			return fail(400, { error: 'Invalid email or password' });
		}

		// Create session
		const session = await lucia.createSession(user.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		throw redirect(302, '/');
	}
};
