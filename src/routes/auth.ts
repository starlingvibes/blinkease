import { Hono } from 'hono';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { securities, users } from '../db/schema';
import bcrypt from 'bcryptjs';
import { decode, sign, verify } from 'hono/jwt';
import { v4 } from 'uuid';

const auth = new Hono();

type NewUser = typeof users.$inferInsert;
type NewSecurity = typeof securities.$inferInsert;

const insertUser = async (db: any, user: NewUser) => {
  const newUser = await db.insert(users).values(user);
  return newUser;
};

const insertSecurity = async (db: any, security: NewSecurity) => {
  const newSecurity = await db.insert(securities).values(security);
  return newSecurity;
};

// TODO: add Zod validations
auth.post('/signup', async (c: any) => {
  const { firstName, lastName, email, password } = await c.req.json();
  const sql = neon(c.env.DATABASE_URL ?? '');
  const db = drizzle(sql);

  const user = (await db.select().from(users)).find(
    (user: any) => user.email === email
  );
  if (user) {
    return c.json({ status: false, message: 'User already exists' }, 400);
  }

  const userId = v4();
  const newUser: NewUser = {
    userId,
    email,
    firstName,
    lastName,
    provider: 'local',
    providerId: email,
  };
  await insertUser(db, newUser);

  const securityId = v4();
  const apiKey = v4();
  const hashedPassword = await bcrypt.hash(password, 10);
  const newSecurity: NewSecurity = {
    securityId,
    userId,
    password: hashedPassword,
    apiKey,
  };
  await insertSecurity(db, newSecurity);

  const token = await sign(
    {
      id: userId,
      role: 'user',
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    c.env.JWT_SECRET
  );

  return c.json({
    status: true,
    message: 'User signed up successfully',
    data: { token, apiKey },
  });
});

// TODO: add Zod validations
auth.post('/login', async (c: any) => {
  const sql = neon(c.env.DATABASE_URL ?? '');
  const db = drizzle(sql);
  const { email, password } = await c.req.json();
  //   const user = await db.select().from(users).where('email', email).single();
  const user = (await db.select().from(users)).find(
    (user: any) => user.email === email
  );
  const security = (await db.select().from(securities)).find(
    (security: any) => security.userId === user?.userId
  );

  await bcrypt.compare(password, security?.password ?? '');
  if (!user || !(await bcrypt.compare(password, security?.password ?? ''))) {
    return c.json({ status: false, message: 'Invalid email or password' }, 401);
  }

  const token = await sign(
    {
      id: user.userId,
      role: 'user',
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    c.env.JWT_SECRET
  );

  return c.json({
    status: true,
    message: 'User logged in successfully',
    data: { token, apiKey: security?.apiKey },
  });
});

export default auth;
