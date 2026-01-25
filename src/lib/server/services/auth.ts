import { Lucia } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { db } from '../db';
import { sessions, users } from '../db/schema/user';
import type { User } from '$lib/types';

// Adapter
const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

// Lucia instance
export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: process.env.NODE_ENV === 'production'
		}
	},
	getUserAttributes: (attributes) => {
		return {
			email: attributes.email,
			username: attributes.username,
			avatarUrl: attributes.avatar_url,
			role: attributes.role
		};
	}
});

// Types
declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: {
			email: string;
			username: string;
			avatar_url: string | null;
			role: string;
		};
	}
}

export type Session = {
	id: string;
	userId: string;
	expiresAt: Date;
};

export type SessionUser = {
	id: string;
	email: string;
	username: string;
	avatarUrl: string | null;
	role: string;
};

// Helper functions
export async function hashPassword(password: string): Promise<string> {
	const bcrypt = await import('bcrypt');
	return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
	const bcrypt = await import('bcrypt');
	return bcrypt.compare(password, hash);
}

export function generateSessionToken(): string {
	const bytes = new Uint8Array(32);
	crypto.getRandomValues(bytes);
	return Array.from(bytes)
		.map(b => b.toString(16).padStart(2, '0'))
		.join('');
}

export async function createSession(userId: string): Promise<Session> {
	const token = generateSessionToken();
	const session = await lucia.createSession(userId, {});
	return {
		id: session.id,
		userId: session.userId,
		expiresAt: session.expiresAt
	};
}

export async function validateSession(sessionId: string): Promise<{ session: Session | null; user: SessionUser | null }> {
	const result = await lucia.validateSession(sessionId);
	
	if (!result.session || !result.user) {
		return { session: null, user: null };
	}

	return {
		session: {
			id: result.session.id,
			userId: result.session.userId,
			expiresAt: result.session.expiresAt
		},
		user: {
			id: result.user.id,
			email: result.user.email,
			username: result.user.username,
			avatarUrl: result.user.avatarUrl,
			role: result.user.role
		}
	};
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await lucia.invalidateSession(sessionId);
}

export { lucia as auth };
