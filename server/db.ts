import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Required for Neon serverless
neonConfig.webSocketConstructor = ws;

// Check if DATABASE_URL environment variable exists
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create a connection pool to the database
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Export drizzle instance with our schema
export const db = drizzle(pool, { schema });