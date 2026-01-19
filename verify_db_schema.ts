
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './src/db/schema';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function verify() {
    try {
        console.log('Verifying database tables...');

        // Attempt to count rows or just select to see if tables exist without error
        const decksCount = await db.select().from(schema.decks).limit(1);
        console.log('Successfully queried decks table.');

        const cardsCount = await db.select().from(schema.cards).limit(1);
        console.log('Successfully queried cards table.');

        console.log('Verification successful: Tables exist.');
    } catch (error) {
        console.error('Verification failed:', error);
    } finally {
        await pool.end();
    }
}

verify();
