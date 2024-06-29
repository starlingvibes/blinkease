import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { config } from 'dotenv';

config({
  path: '.dev.vars',
});

const sql = neon(process.env.DATABASE_URL!);

const db = drizzle(sql);

const main = async () => {
  try {
    await migrate(db, {
      migrationsFolder: './src/db/migrations',
    });

    console.log('Migration successful');
  } catch (error) {
    console.error('Migration failed', error);
    process.exit(1);
  }
};

main();
