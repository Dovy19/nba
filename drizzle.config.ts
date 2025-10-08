import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

export default defineConfig({
  schema: './src/lib/db/schema.ts', // Updated path to include src/
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});