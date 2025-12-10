import { Pool } from "pg";

let pool: Pool | undefined;

if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL not set in environment variables");
} else {
    // Use a global variable to preserve the pool across hot reloads in development
    const globalPool = global as unknown as { _postgresPool: Pool };

    if (!globalPool._postgresPool) {
        globalPool._postgresPool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false // Required for some hosted Postgres providers like Heroku/Koyeb
            },
            max: 10 // defaults to 10
        });
    }

    pool = globalPool._postgresPool;
}

export const db = pool;

export async function query(text: string, params?: any[]) {
    if (!pool) {
        console.error("Database pool not initialized");
        throw new Error("Database pool not initialized");
    }
    return pool.query(text, params);
}
