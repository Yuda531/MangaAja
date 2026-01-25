import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as mangaSchema from './schema/manga';
import * as userSchema from './schema/user';
import { DATABASE_URL } from '$env/static/private';

const sql = neon(DATABASE_URL);

export const db = drizzle(sql, {
	schema: {
		...mangaSchema,
		...userSchema
	}
});

export type Database = typeof db;
